import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Accept both default Vite port and fallback port (when 5173 is already in use)
  const allowedOrigins = [
    process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // was true — caused silent rejection of valid bodies without DTO
    }),
  );

  const port = Number(process.env.APP_PORT) || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}
bootstrap();
