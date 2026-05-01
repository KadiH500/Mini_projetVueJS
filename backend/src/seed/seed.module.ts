import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { AuthorEntity } from '../books/entities/author.entity';
import { BookEntity } from '../books/entities/book.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([AuthorEntity, BookEntity, UserEntity]),
    ],
    providers: [SeedService],
})
export class SeedModule {}