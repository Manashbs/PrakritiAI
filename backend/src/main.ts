import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  return app;
}

let cachedApp: any;
let cachedServer: any;

async function getServerInstance() {
  if (!cachedApp) {
    cachedApp = await bootstrap();
    await cachedApp.init();
    cachedServer = cachedApp.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  try {
    const server = await getServerInstance();
    server(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
}

// Local development
if (!process.env.VERCEL) {
  bootstrap()
    .then(app => {
      const PORT = process.env.PORT ?? 3001;
      return app.listen(PORT);
    })
    .then(() => {
      console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
    })
    .catch(err => {
      console.error('Bootstrap error:', err);
      process.exit(1);
    });
}
