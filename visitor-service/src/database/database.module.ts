import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Visitor } from '../visitors/models/visitor.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      // Each service connects to its own isolated database.
      // The visitor service owns visitor_db and nothing else.
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'visitor_db'),
        models: [Visitor],
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development' ? console.log : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}