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

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  } else {
    const PORT = process.env.PORT ?? 3001;
    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}`);
  }
}

// Global cached instance to prevent memory leaks on serverless cold starts
let cachedServer: any;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
}

// Start local server seamlessly if not on Vercel
if (!process.env.VERCEL) {
  bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
    process.exit(1);
  });
}
