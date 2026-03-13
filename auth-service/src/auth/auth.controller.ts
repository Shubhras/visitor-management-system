import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AUTH_PATTERNS } from '../shared/constants/tcp-patterns';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @MessagePattern(AUTH_PATTERNS.REGISTER)
    register(@Payload() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @MessagePattern(AUTH_PATTERNS.LOGIN)
    login(@Payload() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
    refreshToken(@Payload() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
    forgotPassword(@Payload() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
    resetPassword(@Payload() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
    validateUser(@Payload() payload: { sub: number; email: string; role: string }) {
        return this.authService.validateUser(payload);
    }

    @MessagePattern(AUTH_PATTERNS.LOGOUT)
    logout(@Payload() payload: { userId: number }) {
        return this.authService.logout(payload.userId);
    }
}