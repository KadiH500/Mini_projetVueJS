import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartSer: CartService) {}

  @Get()
  async getCart(@Req() req: Request) {
    return this.cartSer.getCart(req['user']['userId']);
  }

  @Post('add')
  async addToCart(@Req() req: Request, @Body() body: { bookId: number; quantity?: number }) {
    return this.cartSer.addToCart(req['user']['userId'], body.bookId, body.quantity);
  }

  @Patch(':id')
  async updateQuantity(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartSer.updateQuantity(req['user']['userId'], id, quantity);
  }

  @Delete('clear')
  async clearCart(@Req() req: Request) {
    return this.cartSer.clearCart(req['user']['userId']);
  }

  @Delete(':id')
  async removeFromCart(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.cartSer.removeFromCart(req['user']['userId'], id);
  }
}
