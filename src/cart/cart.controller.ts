import { Body, Controller, Delete, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { ItemDTO } from './dtos/item.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/')
    async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
        const userId = req.user.userId;
        const cart = await this.cartService.addItemToCart(userId, itemDTO);
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/')
    async removeItemFromCart(@Request() req, @Body() { productId }) {
        const userId = req.user.userId;
        const cart = await this.cartService.removeItemFromCart(userId, productId);

        if(!cart)
            throw new NotFoundException("Item does not exist");
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/:id')
    async deleteCart(@Param('id') userId: string) {
        const cart = await this.cartService.deleteCart(userId);

        if(!cart) 
            throw new NotFoundException("Cart does not exist");
        return cart;
    }
}
