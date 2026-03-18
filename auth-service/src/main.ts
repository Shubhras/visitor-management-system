import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // We create a pure TCP microservice here, not an HTTP server.
  // The API gateway will connect to this service over TCP.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TCP_HOST || '0.0.0.0',
        port: parseInt(process.env.TCP_PORT) || 4001,
      },
    },
  );

  // This ensures all incoming data is validated against our DTOs before
  // reaching any controller or service method.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('Auth service is running on TCP port 4001');
}

bootstrap();