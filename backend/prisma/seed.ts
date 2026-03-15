import { PrismaClient } from '../prisma/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding PrakritiAI database...');

    // 1. Create a predefined Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@prakritiai.com' },
        update: {},
        create: {
            email: 'admin@prakritiai.com',
            name: 'Prakriti Admin',
            passwordHash: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log(`Upserted Admin: ${admin.email}`);

    // 2. Create a verified Practitioner
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
                    kycVerified: true, // Auto-verified for UI testing
                },
            },
        },
    });
    console.log(`Upserted Doctor: ${doctor.email}`);

    // 3. Create initial Store Products
    const products = [
        { name: 'Ashwagandha Churna', description: 'Stress relief and vitality booster.', price: 250, stock: 50 },
        { name: 'Triphala Tablets', description: 'Digestive health and detox.', price: 150, stock: 100 },
        { name: 'Brahmi Vati', description: 'Cognitive enhancer and memory support.', price: 300, stock: 30 },
        { name: 'Chyawanprash', description: 'Immunity boosting herbal jam.', price: 450, stock: 20 },
    ];

    for (const p of products) {
        // Only create if we have 0 products to avoid duplicate seeding (naive approach)
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
