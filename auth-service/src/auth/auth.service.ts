import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../users/models/user.model';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // Generates both access and refresh tokens for a given user payload.
    // We keep this in a private helper so login, register, and refresh
    // all produce tokens the same way.
    private generateTokens(payload: { sub: number; email: string; role: string }) {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

        // We cast expiresIn as any here because the newer @types/jsonwebtoken
        // restricts expiresIn to a StringValue type but string values like '7d'
        // are perfectly valid at runtime. This avoids adding an extra dependency
        // just to satisfy a type constraint.
        const accessToken = this.jwtService.sign(
            { sub: payload.sub, email: payload.email, role: payload.role },
            {
                secret: jwtSecret,
                expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN', '7d')) as any,
            },
        );

        const refreshToken = this.jwtService.sign(
            { sub: payload.sub, email: payload.email, role: payload.role },
            {
                secret: jwtRefreshSecret,
                expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d')) as any,
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

        // We pass the plain text password directly here.
        // The BeforeCreate hook in the User model handles hashing automatically
        // so we should never hash it manually before passing to create().
        const user = await this.userModel.create({
            name: registerDto.name,
            email: registerDto.email,
            password: registerDto.password,
            role: registerDto.role || 'resident',
        } as any);

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
                name: user.name,
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

        // Always update the stored refresh token on each login so old
        // refresh tokens from previous sessions are automatically invalidated.
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await user.update({ refreshToken: hashedRefresh });

        return {
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        const { refreshToken } = refreshTokenDto;

        let payload: any;
        try {
            // Verify the refresh token signature and expiry before doing anything else.
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

        // Compare the incoming refresh token against the stored hash to confirm
        // it matches the one we issued at login. This prevents token reuse attacks.
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            return { success: false, message: 'Refresh token is no longer valid' };
        }

        const newPayload = { sub: user.id, email: user.email, role: user.role };
        const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(newPayload);

        // Rotate the refresh token on every use so each token can only be used once.
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

        // We return success even if the user does not exist to prevent
        // email enumeration attacks where someone probes for valid accounts.
        if (!user) {
            return {
                success: true,
                message: 'If this email exists, a reset token has been generated',
            };
        }

        // Generate a cryptographically secure random token for the reset link.
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        await user.update({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        });

        // In a production system you would send this token via email.
        // We return it here so it can be used directly during development and testing.
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

        // Check if the reset token has expired. Tokens are valid for 1 hour only.
        if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return { success: false, message: 'Reset token has expired, please request a new one' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Clear the reset token fields after a successful reset so the same
        // token cannot be used again.
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
        // Clearing the refresh token means the user can no longer generate
        // new access tokens. Their current access token will still work until
        // it naturally expires, but no new sessions can be started.
        await this.userModel.update(
            { refreshToken: null },
            { where: { id: userId } },
        );

        return { success: true, message: 'Logged out successfully' };
    }
}