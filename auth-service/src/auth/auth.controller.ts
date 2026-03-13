import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AUTH_PATTERNS } from '../shared/constants/tcp-patterns';


// This controller listens for TCP messages from the API gateway.
// It does not expose any HTTP endpoints directly.
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
  async validateUser(@Payload() payload: { sub: number; email: string; role: string }) {
    return this.authService.validateUser(payload);
  }
}