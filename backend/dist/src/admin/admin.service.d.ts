import { PrismaService } from '../prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getKpis(timeframe?: string): Promise<{
        totalUsers: number;
        totalPatients: number;
        totalDoctors: number;
        totalConsultations: number;
        completedConsultations: number;
    }>;
    getSystemLogs(): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        details: string;
        level: string;
    }[]>;
    getAllUsers(): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        status: any;
        kyc: string;
        kycPhoto: any;
        consultations: any;
        rating: string;
        plan: string;
        orders: number;
    }[]>;
    verifyPractitionerKyc(userId: string): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        userId: string;
        kycPhoto: string | null;
    }>;
    rejectPractitionerKyc(userId: string): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        userId: string;
        kycPhoto: string | null;
    } | {
        message: string;
    }>;
    updateUser(userId: string, data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        status: string;
    }>;
    updateUserStatus(userId: string, status: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        status: string;
    }>;
    createUser(data: any): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            passwordHash: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            status: string;
        };
    }>;
    deleteUser(userId: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        status: string;
    } | {
        success: boolean;
    }>;
    getAllConsultations(): Promise<{
        id: string;
        patientName: string;
        doctorName: string;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        type: string;
        amount: string;
    }[]>;
    cancelConsultation(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        notes: string | null;
        meetLink: string | null;
        practitionerId: string;
        patientId: string;
    }>;
    deleteConsultation(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        notes: string | null;
        meetLink: string | null;
        practitionerId: string;
        patientId: string;
    }>;
    getAllProducts(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }[]>;
    createProduct(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }>;
    updateProduct(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }>;
    getAllOrders(): Promise<({
        user: {
            name: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    })[]>;
    updateOrderStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        totalAmount: number;
    }>;
}
