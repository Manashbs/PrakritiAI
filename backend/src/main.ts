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

  if (!process.env.VERCEL) {
    const PORT = process.env.PORT ?? 3001;
    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}`);
  }
}

// Only run bootstrap in local environment
if (!process.env.VERCEL) {
  bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
    process.exit(1);
  });
}


