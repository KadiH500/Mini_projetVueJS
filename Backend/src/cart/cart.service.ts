import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from './entities/cart.entity';
import { BookEntity } from 'src/books/entities/book.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private cartRepo: Repository<CartItemEntity>,
    @InjectRepository(BookEntity)
    private bookRepo: Repository<BookEntity>,
  ) {}

  async getCart(userId: number): Promise<CartItemEntity[]> {
    return this.cartRepo.find({
      where: { user: { id: userId } },
      relations: ['book', 'book.author'],
    });
  }

  async addToCart(userId: number, bookId: number, quantity: number = 1) {
    const book = await this.bookRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    let cartItem = await this.cartRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepo.create({
        user: { id: userId } as UserEntity,
        book,
        quantity,
      });
    }

    return this.cartRepo.save(cartItem);
  }

  async removeFromCart(userId: number, itemId: number) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId, user: { id: userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.cartRepo.remove(item);
  }

  async clearCart(userId: number) {
    return this.cartRepo.delete({ user: { id: userId } });
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId, user: { id: userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) return this.cartRepo.remove(item);
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }
}
