"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    if (process.env.VERCEL) {
        await app.init();
        return app.getHttpAdapter().getInstance();
    }
    else {
        await app.listen(process.env.PORT ?? 3001);
    }
}
let cachedServer;
async function default_1(req, res) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
}
if (!process.env.VERCEL) {
    bootstrap();
}
//# sourceMappingURL=main.js.map