import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.AUTH_SERVICE_HOST || 'localhost',
            port: parseInt(process.env.AUTH_SERVICE_PORT || '4001')

          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, RolesGuard],
  // Export the guards and JWT module so other gateway modules
  // can use them without re-registering everything.
  exports: [JwtGuard, RolesGuard, JwtModule],
})
export class AuthModule {}