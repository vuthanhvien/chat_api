import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Tài liệu API cho ứng dụng NestJS')
    .setVersion('1.0')
    .addBearerAuth() // nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document); // http://localhost:3000/api

  const port = process.env.PORT || 4321;
  console.log(`Server is running on http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
