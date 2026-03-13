import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AUTH_PATTERNS } from '../shared/constants/tcp-patterns';

@Injectable()
export class AuthService {
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authClient: ClientProxy,
    ) { }

    register(registerDto: RegisterDto) {
        return firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.REGISTER, registerDto),
        );
    }

    login(loginDto: LoginDto) {
        return firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.LOGIN, loginDto),
        );
    }

    refreshToken(refreshTokenDto: RefreshTokenDto) {
        return firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.REFRESH_TOKEN, refreshTokenDto),
        );
    }

    forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        return firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.FORGOT_PASSWORD, forgotPasswordDto),
        );
    }

    resetPassword(resetPasswordDto: ResetPasswordDto) {
        return firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.RESET_PASSWORD, resetPasswordDto),
        );
    }

    logout(userId: number) {
        return firstValueFrom(
            this.authClient.send(AUTH_PATTERNS.LOGOUT, { userId }),
        );
    }
}