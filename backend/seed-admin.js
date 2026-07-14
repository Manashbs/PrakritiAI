const { PrismaClient } = require('./prisma/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@prakritiai.com' },
        update: {
            role: 'ADMIN',
            passwordHash
        },
        create: {
            email: 'admin@prakritiai.com',
            name: 'System Admin',
            role: 'ADMIN',
            passwordHash
        }
    });

    console.log('Admin user created:', admin.email);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
