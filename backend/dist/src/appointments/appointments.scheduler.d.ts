import { PrismaService } from '../prisma.service';
export declare class AppointmentsScheduler {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    autoCompleteStaleAppointments(): Promise<void>;
}
