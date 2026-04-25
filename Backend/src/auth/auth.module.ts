import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Module({
    imports : [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'supersecretcode'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1w') as StringValue,
                },
            }),
        }),
        PassportModule.register({defaultStrategy : 'jwt'})
    ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, UsersController]
})
export class AuthModule {}
