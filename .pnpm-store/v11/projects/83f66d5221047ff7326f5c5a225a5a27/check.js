const { PrismaClient } = require('./node_modules/@prisma/client');

async function check() {
    const p = new PrismaClient();
    const profiles = await p.practitionerProfile.findMany();
    console.log(profiles.map(x => ({
        userId: x.userId,
        kycPhotoLength: x.kycPhoto ? x.kycPhoto.length : null
    })));
    await p.$disconnect();
}
check();
