const { PrismaClient } = require('./prisma/generated/prisma');

// Initialize Prisma with the explicit live Neon connection URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_lDHNG9A2ogqe@ep-wandering-silence-a16ds03z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function fix() {
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@prakritiai.com' },
      update: {
        passwordHash: '$2b$10$aPdDyK5FT35s5.GOBsdee6ahytX60bNS', // Hashed POQ07222@
      },
      create: {
        email: 'admin@prakritiai.com',
        name: 'Prakriti Admin',
        passwordHash: '$2b$10$aPdDyK5FT35s5.GOBsdee6ahytX60bNS',
        role: 'ADMIN',
      },
    });
    console.log('SUCCESS: Admin password forced to POQ07222@ on live DB.');
  } catch (error) {
    console.error('FAILED TO UPDATE:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
