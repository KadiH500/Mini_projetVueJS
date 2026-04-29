import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private configSer : ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configSer.get<string>('JWT_SECRET', 'supersecretcode')
    });
  }

  async validate(payload: any) {
    let u = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!u) {
      throw new UnauthorizedException('Invalid token');
    }
    return { userRole: u.role, userId : u.id };
  }
}
