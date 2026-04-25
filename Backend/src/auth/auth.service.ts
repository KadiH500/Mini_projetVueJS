import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './generics/role.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtSer: JwtService,
  ) {}

  /** Auto-seed default accounts so the app works on a fresh DB */
  async onModuleInit() {
    await this.seedDefaultUsers();
  }

  private async seedDefaultUsers() {
    const defaults = [
      {
        name: 'Admin',
        email: 'admin@libraria.com',
        username: 'admin',
        password: 'Admin1234!',
        role: Roles.ROLE_ADMIN,
      },
      {
        name: 'Demo User',
        email: 'user@libraria.com',
        username: 'demouser',
        password: 'User1234!',
        role: Roles.ROLE_USER,
      },
    ];

    for (const def of defaults) {
      const exists = await this.userRepo.findOne({
        where: [{ email: def.email }, { username: def.username }],
      });
      if (exists) continue;

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(def.password, salt);
      const entity = this.userRepo.create({
        name: def.name,
        email: def.email,
        username: def.username,
        password: hashed,
        salt,
        role: def.role,
      });
      await this.userRepo.save(entity);
      this.logger.log(`✅ Seeded default account: ${def.email} (${def.role})`);
    }
  }

  async signUp(informations) {
    let newUserEntity = this.userRepo.create({
      name: informations.name || null,
      email: informations.email,
      username: informations.username,
      role: informations.role || Roles.ROLE_USER,
      salt: await bcrypt.genSalt(),
    });

    newUserEntity.password = await bcrypt.hash(
      informations.password,
      newUserEntity.salt,
    );

    try {
      let data = await this.userRepo.save(newUserEntity);
      const { password: _p, salt: _s, ...safeData } = data;
      return safeData;
    } catch {
      throw new ConflictException('Email or username already exists');
    }
  }

  async signIn(informations) {
    let { identifiant, password } = informations;

    let user = await this.userRepo
      .createQueryBuilder('user')
      .select('user')
      .where('user.username = :ident or user.email = :ident')
      .setParameter('ident', identifiant)
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    let resultMatching = await bcrypt.compare(password, user.password);

    if (resultMatching) {
      let token = this.jwtSer.sign({ id: user.id });
      const { password: _password, salt: _salt, ...safeUser } = user;
      return {
        ...safeUser,
        access_token: token,
      };
    } else {
      throw new NotFoundException('Incorrect password');
    }
  }

  async getAllUsers() {
    return this.userRepo.find({
      select: ['id', 'name', 'email', 'username', 'role'],
    });
  }

  async updateUserRole(id: number, role: Roles) {
    let user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    return this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    let user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.remove(user);
    return { deleted: true, id };
  }
}

