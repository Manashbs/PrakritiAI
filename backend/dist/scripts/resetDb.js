"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting database reset...');
    try {
        console.log('Deleting SystemLogs...');
        await prisma.systemLog.deleteMany();
        console.log('Deleting OrderItems...');
        await prisma.orderItem.deleteMany();
        console.log('Deleting Orders...');
        await prisma.order.deleteMany();
        console.log('Deleting PrescriptionMedicines...');
        await prisma.prescriptionMedicine.deleteMany();
        console.log('Deleting Prescriptions...');
        await prisma.prescription.deleteMany();
        console.log('Deleting Appointments...');
        await prisma.appointment.deleteMany();
        console.log('Deleting Products...');
        await prisma.product.deleteMany();
        console.log('Deleting PractitionerProfiles...');
        await prisma.practitionerProfile.deleteMany();
        console.log('Deleting Users (except ADMINs)...');
        await prisma.user.deleteMany({
            where: {
                role: {
                    not: 'ADMIN',
                },
            },
        });
        console.log('Database reset successfully. Only Admin users remain.');
    }
    catch (error) {
        console.error('Error during database reset:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=resetDb.js.map