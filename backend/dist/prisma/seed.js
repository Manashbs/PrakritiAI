"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../prisma/generated/prisma");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new prisma_1.PrismaClient();
async function main() {
    console.log('Seeding PrakritiAI database...');
    const adminPassword = await bcrypt.hash('POQ07222@', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@prakritiai.com' },
        update: {
            passwordHash: adminPassword,
        },
        create: {
            email: 'admin@prakritiai.com',
            name: 'Prakriti Admin',
            passwordHash: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log(`Upserted Admin: ${admin.email}`);
    const docPassword = await bcrypt.hash('doctor123', 10);
    const doctor = await prisma.user.upsert({
        where: { email: 'doctor@prakritiai.com' },
        update: {},
        create: {
            email: 'doctor@prakritiai.com',
            name: 'Vaidya Harish Kumar',
            passwordHash: docPassword,
            role: 'PRACTITIONER',
            practitionerProfile: {
                create: {
                    specialties: ['Panchakarma', 'Digestive Disorders'],
                    bio: 'Expert in traditional Kerala Ayurvedic methods with 15 years of experience.',
                    consultationFee: 500,
                    kycVerified: true,
                },
            },
        },
    });
    console.log(`Upserted Doctor: ${doctor.email}`);
    const products = [
        { name: 'Ashwagandha Churna', description: 'Stress relief and vitality booster.', price: 250, stock: 50 },
        { name: 'Triphala Tablets', description: 'Digestive health and detox.', price: 150, stock: 100 },
        { name: 'Brahmi Vati', description: 'Cognitive enhancer and memory support.', price: 300, stock: 30 },
        { name: 'Chyawanprash', description: 'Immunity boosting herbal jam.', price: 450, stock: 20 },
    ];
    for (const p of products) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } });
        if (!existing) {
            await prisma.product.create({ data: p });
            console.log(`Created product: ${p.name}`);
        }
    }
    console.log('Seeding completed successfully! 🎉');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map