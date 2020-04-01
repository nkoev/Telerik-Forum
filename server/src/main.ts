import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import "reflect-metadata";
import { attachUser } from './common/middlewares/attach-user';
import { SystemExceptionFilter } from './common/filters/system-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Telerik Forum')
    .setDescription('Forum API description')
    .setVersion('1.0')
    .addTag('forum')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.use(attachUser);
  app.useGlobalFilters(new SystemExceptionFilter());

  await app.listen(3000);
}

bootstrap();
