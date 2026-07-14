import { Controller, Get, Patch, Param, UseGuards, Request, ForbiddenException, Query, Delete, Body, Post, ConflictException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    private checkAdmin(req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied: Admins only');
        }
    }

    @Get('logs')
    async getSystemLogs(@Request() req) {
        this.checkAdmin(req);
        return this.adminService.getSystemLogs();
    }

    @Get('kpis')
    async getKpis(@Request() req, @Query('timeframe') timeframe: string) {
        this.checkAdmin(req);
        return this.adminService.getKpis(timeframe);
    }

    @Get('users')
    async getAllUsers(@Request() req) {
        this.checkAdmin(req);
        return this.adminService.getAllUsers();
    }

    @Post('users')
    async createUser(@Request() req, @Body() data: any) {
        this.checkAdmin(req);
        return this.adminService.createUser(data);
    }

    @Delete('users/:id')
    async deleteUser(@Request() req, @Param('id') id: string) {
        this.checkAdmin(req);
        return this.adminService.deleteUser(id);
    }

    @Patch('users/:id')
    async updateUser(@Request() req, @Param('id') id: string, @Body() data: any) {
        this.checkAdmin(req);
        return this.adminService.updateUser(id, data);
    }

    @Patch('users/:id/status')
    async updateUserStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
        this.checkAdmin(req);
        return this.adminService.updateUserStatus(id, status);
    }

    @Patch('practitioners/:id/verify')
    async verifyPractitionerKyc(@Request() req, @Param('id') practitionerId: string) {
        this.checkAdmin(req);
        return this.adminService.verifyPractitionerKyc(practitionerId);
    }

    @Patch('practitioners/:id/reject')
    async rejectPractitionerKyc(@Request() req, @Param('id') practitionerId: string) {
        this.checkAdmin(req);
        return this.adminService.rejectPractitionerKyc(practitionerId);
    }

    @Get('consultations')
    async getAllConsultations(@Request() req) {
        this.checkAdmin(req);
        return this.adminService.getAllConsultations();
    }

    @Patch('consultations/:id/cancel')
    async cancelConsultation(@Request() req, @Param('id') id: string) {
        this.checkAdmin(req);
        return this.adminService.cancelConsultation(id);
    }

    @Delete('consultations/:id')
    async deleteConsultation(@Request() req, @Param('id') id: string) {
        this.checkAdmin(req);
        return this.adminService.deleteConsultation(id);
    }

    // E-Commerce Routes
    @Get('products')
    async getAllProducts(@Request() req) {
        this.checkAdmin(req);
        return this.adminService.getAllProducts();
    }

    @Post('products')
    async createProduct(@Request() req, @Body() data: any) {
        this.checkAdmin(req);
        return this.adminService.createProduct(data);
    }

    @Patch('products/:id')
    async updateProduct(@Request() req, @Param('id') id: string, @Body() data: any) {
        this.checkAdmin(req);
        return this.adminService.updateProduct(id, data);
    }

    @Delete('products/:id')
    async deleteProduct(@Request() req, @Param('id') id: string) {
        this.checkAdmin(req);
        return this.adminService.deleteProduct(id);
    }

    @Get('orders')
    async getAllOrders(@Request() req) {
        this.checkAdmin(req);
        return this.adminService.getAllOrders();
    }

    @Patch('orders/:id/status')
    async updateOrderStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
        this.checkAdmin(req);
        return this.adminService.updateOrderStatus(id, status);
    }
}
