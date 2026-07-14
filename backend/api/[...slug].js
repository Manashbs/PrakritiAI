const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { json, urlencoded } = require('express');

let cachedApp;

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
  await app.init();
  return app.getHttpAdapter().getInstance();
}

module.exports = async (req, res) => {
  try {
    if (!cachedApp) {
      cachedApp = await bootstrap();
    }
    cachedApp(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
};
