import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database reset...');

  try {
    // Delete in reverse order of dependencies to avoid foreign key constraints
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
  } catch (error) {
    console.error('Error during database reset:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
