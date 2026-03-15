"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcommerceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EcommerceService = class EcommerceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts() {
        return this.prisma.product.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async createOrder(userId, items) {
        let totalAmount = 0;
        const orderItemsData = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
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
            await this.prisma.product.update({
                where: { id: product.id },
                data: { stock: product.stock - item.quantity },
            });
        }
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
    async getMyOrders(userId) {
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
};
exports.EcommerceService = EcommerceService;
exports.EcommerceService = EcommerceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EcommerceService);
//# sourceMappingURL=ecommerce.service.js.map