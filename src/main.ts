import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payload into DTO types
      whitelist: true, // Automatically remove properties not in the DTO
      forbidNonWhitelisted: true, // Throw an error if there are properties not in the DTO
    }),
  );
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
