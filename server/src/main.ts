import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import "reflect-metadata";
import { SystemExceptionFilter } from './common/filters/system-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Telerik Forum')
    .setDescription('Forum API description')
    .setVersion('1.0')
    .addTag('forum')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalFilters(new SystemExceptionFilter());

  await app.listen(app.get(ConfigService).get('PORT'));
}

bootstrap();
