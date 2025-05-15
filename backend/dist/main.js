"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const express = require("express");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use('/uploads/images', express.static((0, path_1.join)(__dirname, '..', 'uploads/images')));
    app.use('/uploads/pdfs', express.static((0, path_1.join)(__dirname, '..', 'uploads/pdfs')));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        validationError: { target: false, value: true },
        stopAtFirstError: false,
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
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Tiki Resto API')
        .setDescription('API pour le restaurant Tiki au Bord de l\'Eau')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3001 || "0.0.0.1" || "0.0.0.0";
    const host = configService.get('HOST') || 'localhost';
    await app.listen(port, host);
    (`Application is running on: http://${host}:${port}`);
    (`Swagger documentation: http://${host}:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map