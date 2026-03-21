import { PrismaService } from '../prisma.service';
export declare class EcommerceService {
    private prisma;
    constructor(prisma: PrismaService);
    getProducts(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }[]>;
    createOrder(userId: string, items: {
        productId: string;
        quantity: number;
    }[]): Promise<{
        items: {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: number;
    }>;
    getMyOrders(userId: string): Promise<({
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
}
