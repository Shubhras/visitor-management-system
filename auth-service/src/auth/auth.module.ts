import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
    // Auth service needs a TCP client to notify the user service
    // whenever a new account is registered so both databases stay in sync.
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.USER_SERVICE_HOST || 'localhost',
            port: parseInt(process.env.USER_SERVICE_PORT) || 4002,
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}