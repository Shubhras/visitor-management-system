import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: 'VISITOR_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.VISITOR_SERVICE_HOST || 'localhost',
            port: parseInt(process.env.VISITOR_SERVICE_PORT || '4003')

          },
        }),
      },
    ]),
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}