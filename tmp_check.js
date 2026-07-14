const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const profiles = await prisma.practitionerProfile.findMany();
    console.log(profiles.map(p => ({
        id: p.id,
        hasPhoto: !!p.kycPhoto,
        photoLength: p.kycPhoto ? p.kycPhoto.length : 0
    })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
