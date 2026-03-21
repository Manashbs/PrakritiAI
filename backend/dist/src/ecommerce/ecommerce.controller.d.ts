import { EcommerceService } from './ecommerce.service';
export declare class EcommerceController {
    private readonly ecommerceService;
    constructor(ecommerceService: EcommerceService);
    getProducts(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
    }[]>;
    createOrder(req: any, items: {
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
    getMyOrders(req: any): Promise<({
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
