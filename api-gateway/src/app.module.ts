import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { VisitorsModule } from './visitors/visitors.module';
import { UsersModule } from './users/users.module';

// Register all three microservice TCP clients at the root level
// so any module in the gateway can inject and use them.
const microserviceClients = ClientsModule.registerAsync([
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
  {
    name: 'USER_SERVICE',
    useFactory: () => ({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT || '4002')
      },
    }),
  },
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
]);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    microserviceClients,
    AuthModule,
    UsersModule,
    VisitorsModule,
  ],
})
export class AppModule {}