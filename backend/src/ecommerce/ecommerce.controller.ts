import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ecommerce')
@UseGuards(JwtAuthGuard)
export class EcommerceController {
    constructor(private readonly ecommerceService: EcommerceService) { }

    @Get('products')
    async getProducts() {
        return this.ecommerceService.getProducts();
    }

    @Post('orders')
    async createOrder(
        @Request() req,
        @Body('items') items: { productId: string; quantity: number }[]
    ) {
        return this.ecommerceService.createOrder(req.user.id, items);
    }

    @Get('orders/my-orders')
    async getMyOrders(@Request() req) {
        return this.ecommerceService.getMyOrders(req.user.id);
    }
}
