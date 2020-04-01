import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import "reflect-metadata";
import { attachUser } from './common/middlewares/attach-user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(attachUser)
  const options = new DocumentBuilder()
    .setTitle('Telerik Forum')
    .setDescription('Forum API description')
    .setVersion('1.0')
    .addTag('forum')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
