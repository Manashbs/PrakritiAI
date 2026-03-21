import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    private checkAdmin;
    getSystemLogs(req: any): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        details: string;
        level: string;
    }[]>;
    getKpis(req: any, timeframe: string): Promise<{
        totalUsers: number;
        totalPatients: number;
        totalDoctors: number;
        totalConsultations: number;
        completedConsultations: number;
    }>;
    getAllUsers(req: any): Promise<{
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
    createUser(req: any, data: any): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            passwordHash: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            resetPasswordToken: string | null;
            status: string;
            resetPasswordExpires: Date | null;
        };
    }>;
    deleteUser(req: any, id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        resetPasswordToken: string | null;
        status: string;
        resetPasswordExpires: Date | null;
    } | {
        success: boolean;
    }>;
    updateUser(req: any, id: string, data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        resetPasswordToken: string | null;
        status: string;
        resetPasswordExpires: Date | null;
    }>;
    updateUserStatus(req: any, id: string, status: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        resetPasswordToken: string | null;
        status: string;
        resetPasswordExpires: Date | null;
    }>;
    verifyPractitionerKyc(req: any, practitionerId: string): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        kycPhoto: string | null;
        userId: string;
    }>;
    rejectPractitionerKyc(req: any, practitionerId: string): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        kycPhoto: string | null;
        userId: string;
    } | {
        message: string;
    }>;
    getAllConsultations(req: any): Promise<{
        id: string;
        patientName: string;
        doctorName: string;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        type: string;
        amount: string;
    }[]>;
    cancelConsultation(req: any, id: string): Promise<{
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
    deleteConsultation(req: any, id: string): Promise<{
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
    getAllProducts(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }[]>;
    createProduct(req: any, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }>;
    updateProduct(req: any, id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }>;
    deleteProduct(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }>;
    getAllOrders(req: any): Promise<({
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
        status: string;
        userId: string;
        totalAmount: number;
    })[]>;
    updateOrderStatus(req: any, id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: number;
    }>;
}
