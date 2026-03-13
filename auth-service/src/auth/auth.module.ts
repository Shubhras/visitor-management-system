import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/models/user.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        // We register JwtModule without a default secret here because
        // each token operation passes its own secret explicitly in the service.
        // This gives us full control over access vs refresh token secrets.
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }