import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity) private bookRepo: Repository<BookEntity>,
    @InjectRepository(AuthorEntity) private authorRepo: Repository<AuthorEntity>,
  ) {}

  async getAllBooks() {
    try {
      await this.seedDefaultBooks();
      let tab = await this.bookRepo.find({
        relations: {
          author: true,
        },
      });
      return tab;
    } catch (err) {
      return { message: 'Problème avec TypeOrm' };
    }

    // this.bookRepo.find().then(res => {
    //     console.log(res);

    // }).catch(err => {
    //     console.log(err);
    // })
  }

  addBook(newBook, idUser) {
    newBook.user = idUser;
    return this.bookRepo.save(newBook);
  }

  async getBookById(selectedId) {
    try {
      let selectedBooks = await this.bookRepo.find({
        where: {
          id: selectedId,
        },
        relations : {
            author : true
        },
        select : {
            author : {
                prenom : true,
                nom : true
            }
        }
      });
      if (!selectedBooks.length) throw new NotFoundException();
      else return selectedBooks;
    } catch (err) {
      return err;
    }
  }

  async updateBook(selectedId, uBook) {
    let b = await this.bookRepo.preload({
      id: selectedId,
      //   title: uBook.title,
      //   editor: uBook.editor,
      //   year: uBook.year,
      //   image: uBook.image,
      ...uBook,
    });
    if (!b) throw new NotFoundException('Livre introuvable');
    let response = await this.bookRepo.save(b);
    return { message: 'Livre mise à jour', response };
  }

  async deleteBook(id) {
    let response = await this.bookRepo.delete(id);
    return response;
  }

  async removeBook(selectedId) {
    let selectedBook = await this.bookRepo.findOneBy({
      id: selectedId,
    });
    if (!selectedBook) throw new NotFoundException('Livre introuvable');
    let response = await this.bookRepo.remove(selectedBook);
    return {
        message: `Le livre ${response.title} a été supprimé avec succès`,
    };
}

async softDeleteBook(id) {
    let reponse = await this.bookRepo.softDelete(id)
    return reponse;
}

async restoreBook(id) {
    let reponse = await this.bookRepo.restore(id);
    return reponse;
}

 async recoverBook(selectedId) {
    let selectedBook = await this.bookRepo.findOneBy({
      id: selectedId,
      
    });
    if (!selectedBook) throw new NotFoundException('Livre introuvable');
    let response = await this.bookRepo.recover(selectedBook);
    return {
        message: `Le livre ${response.title} a été restauré avec succès`,
    };
}

async softRemoveBook(selectedId) {
      let selectedBook = await this.bookRepo.findOneBy({
        id: selectedId,
      });
    if (!selectedBook) throw new NotFoundException('Livre introuvable');
    let reponse = await this.bookRepo.softRemove(selectedBook)
    return reponse;
  }
  
  async nbBooksPerYear() {
    let qb = this.bookRepo.createQueryBuilder('book');
    return qb.select('book.year, count(book.id) as NbBooks')
    .groupBy('book.year')
    .getRawMany()
  }
  
  async nbBooksPerYearV2(y1, y2) {
    let qb = this.bookRepo.createQueryBuilder('book');
    return qb.select('book.year, count(book.id) as NbBooks')
    .where('book.year >= :yearMin and book.year <= :yearMax', {yearMin : y1, yearMax : y2})
    //.setParameters({yearMin : y1, yearMax : y2})
    .groupBy('book.year')
    .getRawMany()
  }

  private async seedDefaultBooks() {
    const defaultBooks = [];

    for (const defaultBook of defaultBooks) {
      let author = await this.authorRepo.findOne({
        where: {
          prenom: defaultBook.author.prenom,
          nom: defaultBook.author.nom,
        },
      });

      if (!author) {
        author = await this.authorRepo.save(defaultBook.author);
      }

      const existingBook = await this.bookRepo.findOne({
        where: {
          title: defaultBook.title,
        },
      });

      if (existingBook) {
        await this.bookRepo.save({
          ...existingBook,
          year: defaultBook.year,
          editor: defaultBook.editor,
          image: defaultBook.image,
          author,
          price: defaultBook.price,
          category: defaultBook.category,
          rating: defaultBook.rating,
          isNew: defaultBook.isNew,
          discount: defaultBook.discount,
        });
        continue;
      }

      await this.bookRepo.save({
        title: defaultBook.title,
        year: defaultBook.year,
        editor: defaultBook.editor,
        image: defaultBook.image,
        author,
        price: defaultBook.price,
        category: defaultBook.category,
        rating: defaultBook.rating,
        isNew: defaultBook.isNew,
        discount: defaultBook.discount,
      });
    }
  }
}
