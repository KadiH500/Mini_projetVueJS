import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { BookEntity } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity, BookEntity])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
