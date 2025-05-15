import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  // Créer les dossiers d'upload s'ils n'existent pas
  const uploadsDir = join(__dirname, '..', 'uploads');
  const imagesDir = join(uploadsDir, 'images');
  const pdfsDir = join(uploadsDir, 'pdfs');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Dossier uploads créé');
  }
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('Dossier uploads/images créé');
  }
  
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
    console.log('Dossier uploads/pdfs créé');
  }
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuration CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  // Servir les images uploadées
  app.use('/uploads/images', express.static(join(__dirname, '..', 'uploads/images')));
  
  // Servir les PDFs uploadés
  app.use('/uploads/pdfs', express.static(join(__dirname, '..', 'uploads/pdfs')));
  
  // Validation des données avec affichage détaillé des erreurs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
    validationError: { target: false, value: true },
    stopAtFirstError: false, // Afficher toutes les erreurs
    exceptionFactory: (errors) => {
      const formattedErrors = errors.reduce((acc, err) => {
        const property = err.property;
        const constraints = err.constraints ? Object.values(err.constraints) : ['Validation error'];
        acc[property] = constraints;
        return acc;
      }, {});
      console.log('Validation errors:', formattedErrors);
      return { statusCode: 400, message: 'Bad Request', errors: formattedErrors };
    }
  }));
  
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Tiki Resto API')
    .setDescription('API pour le restaurant Tiki au Bord de l\'Eau')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
  console.log(`Swagger documentation: http://0.0.0.0:${port}/api`);
}
bootstrap();
