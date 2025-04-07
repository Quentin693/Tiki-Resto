import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuration CORS
  app.enableCors();
  
  // Servir les images uploadées
  app.useStaticAssets(join(__dirname, '..', 'uploads/images'), {
    prefix: '/images',
  });
  
  // Configuration de la validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Tiki Resto API')
    .setDescription('API pour le restaurant Tiki')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3001);
}
bootstrap();
