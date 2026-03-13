import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { AUTH_PATTERNS } from '../shared/constants/tcp-patterns';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async login(loginDto: LoginDto) {
    // Forward the login request to the auth microservice over TCP.
    // firstValueFrom converts the observable response into a promise
    // so we can use async/await cleanly.
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGIN, loginDto),
    );
  }
}