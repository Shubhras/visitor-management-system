import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { User } from '../users/models/user.model';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { USER_PATTERNS } from '../shared/constants/tcp-patterns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  private generateTokens(payload: { sub: number; email: string; role: string }) {
    const accessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d') as any,
      },
    );

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userModel.findOne({
      where: { email: registerDto.email },
    });

    if (existing) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Create the auth record with credentials only.
    // The BeforeCreate hook handles password hashing automatically.
    const user = await this.userModel.create({
      email: registerDto.email,
      password: registerDto.password,
      role: registerDto.role || 'resident',
    } as any);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await user.update({ refreshToken: hashedRefresh });

    // Sync the full profile to the user service so user_db stays consistent
    // with auth_db. We fire this after the auth record is created successfully.
    // If user service sync fails we log it but do not roll back the registration
    // since the user can still authenticate.
    try {
      await firstValueFrom(
        this.userClient.send(USER_PATTERNS.SYNC_FROM_AUTH, {
          id: user.id,
          name: registerDto.name,
          email: registerDto.email,
          role: registerDto.role || 'resident',
        }),
      );
    } catch (err) {
      console.error('Failed to sync new user to user service:', err.message);
    }

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: registerDto.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await user.update({ refreshToken: hashedRefresh });

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return { success: false, message: 'Invalid or expired refresh token' };
    }

    const user = await this.userModel.findByPk(payload.sub);
    if (!user || !user.refreshToken) {
      return { success: false, message: 'Access denied' };
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      return { success: false, message: 'Refresh token is no longer valid' };
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(newPayload);

    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
    await user.update({ refreshToken: hashedRefresh });

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      return {
        success: true,
        message: 'If this email exists, a reset token has been generated',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    return {
      success: true,
      message: 'Password reset token generated successfully',
      resetToken,
      expiresAt: resetExpires,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      return { success: false, message: 'Invalid reset token' };
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return { success: false, message: 'Reset token has expired, please request a new one' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshToken: null,
    });

    return { success: true, message: 'Password reset successfully. Please log in with your new password.' };
  }

  async validateUser(payload: { sub: number; email: string; role: string }) {
    const user = await this.userModel.findByPk(payload.sub);
    if (!user) {
      return null;
    }

    return { id: user.id, email: user.email, role: user.role };
  }

  async logout(userId: number) {
    await this.userModel.update(
      { refreshToken: null },
      { where: { id: userId } },
    );

    return { success: true, message: 'Logged out successfully' };
  }
}