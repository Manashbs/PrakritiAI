const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function seed() {
    console.log("Seeding Mock Data...");

    // 1. Create Mock Products
    const prods = [
        { name: "Ashwagandha Extract", description: "Stress relief", price: 499, stock: 120 },
        { name: "Triphala Churna", description: "Digestive health", price: 299, stock: 85 },
        { name: "Brahmi Vati", description: "Cognitive support", price: 350, stock: 40 },
        { name: "Chyawanprash Awaleha", description: "Immunity booster", price: 550, stock: 200 },
        { name: "Kumkumadi Tailam", description: "Skin care oil", price: 1200, stock: 15 }
    ];

    for (const p of prods) {
        await prisma.product.create({ data: p });
    }
    console.log("Mock Products Seeded.");

    console.log("Done.");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
