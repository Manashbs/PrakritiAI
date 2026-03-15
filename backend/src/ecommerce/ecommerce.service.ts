import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EcommerceService {
    constructor(private prisma: PrismaService) { }

    async getProducts() {
        return this.prisma.product.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async createOrder(userId: string, items: { productId: string; quantity: number }[]) {
        // Basic implementation for MVP: calculate total, verify stock, create order
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            const price = product.price * item.quantity;
            totalAmount += price;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price,
            });

            // Deduct stock (ideally in a transaction)
            await this.prisma.product.update({
                where: { id: product.id },
                data: { stock: product.stock - item.quantity },
            });
        }

        // Create the order
        return this.prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'PENDING',
                items: {
                    create: orderItemsData,
                },
            },
            include: { items: true },
        });
    }

    async getMyOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
