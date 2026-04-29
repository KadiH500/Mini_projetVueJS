import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/auth/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';

@Entity('cart_item')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, { eager: true, onDelete: 'CASCADE' })
  book: BookEntity;
}
