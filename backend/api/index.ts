import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { json, urlencoded } from 'express';

// Global cached instance to prevent memory leaks on serverless cold starts
let cachedServer: any;

export default async function (req: any, res: any) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}
