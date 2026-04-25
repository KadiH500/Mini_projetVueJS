import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin/is-admin.guard';
import { Roles } from './generics/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class UsersController {
    constructor(private authSer: AuthService) {}

    @Get()
    async getAllUsers() {
        return this.authSer.getAllUsers();
    }

    @Put(':id')
    async updateUserRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: Roles) {
        return this.authSer.updateUserRole(id, role);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.authSer.deleteUser(id);
    }
}
