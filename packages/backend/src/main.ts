import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SubdomainMiddleware } from './middleware/subdomain.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  });

  // Enable subdomain middleware for multi-tenant routing
  app.use(new SubdomainMiddleware().use.bind(new SubdomainMiddleware()));

  // Enable validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);
}

void bootstrap();
