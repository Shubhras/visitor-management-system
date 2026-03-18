import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      // We use the async factory pattern so we can pull values from
      // the config service instead of hardcoding connection details.
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'auth_db'),
        models: [User],
        // Do not auto-sync in production. We use migrations instead.
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development' ? console.log : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}