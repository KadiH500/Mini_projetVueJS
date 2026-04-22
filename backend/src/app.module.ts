import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BooksModule } from './books/books.module';
import { FirstMiddleware } from './middlewares/first/first.middleware';
import { SecondMiddleware } from './middlewares/second/second.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TasksModule,
    BooksModule,
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        password: 'root',
        database: 'books',
        autoLoadEntities: true,
        synchronize: true,
}),
    AuthModule,
    ConfigModule.forRoot({
  isGlobal: true,
})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecondMiddleware).forRoutes('');
    consumer.apply(FirstMiddleware).forRoutes({
      path: 'tasks/*',
      method: RequestMethod.GET,
    });
  }
  
  constructor(private readonly configSer: ConfigService) {}
}
