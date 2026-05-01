import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from '../books/entities/author.entity';
import { BookEntity } from '../books/entities/book.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { Roles } from '../auth/generics/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);

    constructor(
    @InjectRepository(AuthorEntity) private authorRepo: Repository<AuthorEntity>,
    @InjectRepository(BookEntity)   private bookRepo:   Repository<BookEntity>,
    @InjectRepository(UserEntity)   private userRepo:   Repository<UserEntity>,
    ) {}

    async onApplicationBootstrap() {
    await this.seedUsers();
    await this.seedAuthorsAndBooks();
    }

  // ─── Users ────────────────────────────────────────────────────────────────
    private async seedUsers() {
    const existingAdmin = await this.userRepo.findOne({ where: { username: 'admin' } });
    if (existingAdmin) return; // déjà seedé

    this.logger.log('🌱 Création des utilisateurs par défaut...');

    const usersData = [
        { username: 'admin',   email: 'admin@bookshop.com',   password: 'admin123',  role: Roles.ROLE_ADMIN },
        { username: 'student', email: 'student@bookshop.com', password: 'student123', role: Roles.ROLE_USER  },
    ];

    for (const u of usersData) {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(u.password, salt);
        const user = this.userRepo.create({
        username: u.username,
        email:    u.email,
        password: hashed,
        salt,
        role:     u.role,
        });
        await this.userRepo.save(user);
    }

    this.logger.log('✅ Utilisateurs créés :');
    this.logger.log('   Admin  → username: admin   / password: admin123');
    this.logger.log('   User   → username: student / password: student123');
    }

  // ─── Authors + Books ──────────────────────────────────────────────────────
    private async seedAuthorsAndBooks() {
    const existingCount = await this.authorRepo.count();
    if (existingCount > 0) return; // déjà seedé

    this.logger.log('🌱 Insertion des auteurs et livres...');

    // --- Auteurs ---
    const authorsData = [
        { prenom: 'Albert',         nom: 'Camus'          },
        { prenom: 'Harper',         nom: 'Lee'            },
        { prenom: 'F. Scott',       nom: 'Fitzgerald'     },
        { prenom: 'Gabriel García', nom: 'Márquez'        },
        { prenom: 'Herman',         nom: 'Melville'       },
        { prenom: 'Leo',            nom: 'Tolstoy'        },
        { prenom: 'George',         nom: 'Orwell'         },
        { prenom: 'Victor',         nom: 'Hugo'           },
    ];

    const authors: AuthorEntity[] = [];
    for (const a of authorsData) {
        const author = this.authorRepo.create(a);
        authors.push(await this.authorRepo.save(author));
    }

    // Images réelles depuis Open Library Covers API (par ISBN)
    const booksData = [
        {
        title:  "L'Étranger",
        year:   1942,
        editor: 'Gallimard',
        image:  'https://covers.openlibrary.org/b/isbn/9782070360024-L.jpg',
        author: authors[0], // Camus
        },
        {
        title:  'To Kill a Mockingbird',
        year:   1960,
        editor: 'J.B. Lippincott & Co.',
        image:  'https://covers.openlibrary.org/b/isbn/9780061935466-L.jpg',
        author: authors[1], // Harper Lee
        },
        {
        title:  'The Great Gatsby',
        year:   1925,
        editor: "Charles Scribner's Sons",
        image:  'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
        author: authors[2], // Fitzgerald
        },
        {
        title:  '100 Years of Solitude',
        year:   1967,
        editor: 'Harper & Row',
        image:  'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
        author: authors[3], // Márquez
        },
        {
        title:  'Moby Dick',
        year:   1851,
        editor: 'Harper & Brothers',
        image:  'https://covers.openlibrary.org/b/isbn/9781503280786-L.jpg',
        author: authors[4], // Melville
        },
        {
        title:  'War and Peace',
        year:   1869,
        editor: 'The Russian Messenger',
        image:  'https://covers.openlibrary.org/b/isbn/9781400079988-L.jpg',
        author: authors[5], // Tolstoy
        },
        {
        title:  '1984',
        year:   1949,
        editor: 'Secker & Warburg',
        image:  'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
        author: authors[6], // Orwell
        },
        {
        title:  'Les Misérables',
        year:   1862,
        editor: 'A. Lacroix',
        image:  'https://covers.openlibrary.org/b/isbn/9780451419439-L.jpg',
        author: authors[7], // Hugo
        },
        {
        title:  'Animal Farm',
        year:   1945,
        editor: 'Secker & Warburg',
        image:  'https://covers.openlibrary.org/b/isbn/9780452284241-L.jpg',
        author: authors[6], // Orwell
        },
        {
        title:  'La Peste',
        year:   1947,
        editor: 'Gallimard',
        image:  'https://covers.openlibrary.org/b/isbn/9782070360123-L.jpg',
        author: authors[0], // Camus
        },
    ];

    for (const b of booksData) {
        const book = this.bookRepo.create(b);
        await this.bookRepo.save(book);
    }

    this.logger.log(`✅ ${booksData.length} livres et ${authorsData.length} auteurs insérés.`);
    }
}