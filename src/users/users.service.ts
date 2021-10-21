import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { Equal, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneOrFail(id);
  }

  async createOrUpdate(dto: CreateUserDto): Promise<User> {
    const adminEmail = process.env.ADMIN_EMAIL.split(',');
    const { email, name } = dto;
    const user = await this.usersRepository.findOne({
      email: Equal(email),
    });

    if (!user) {
      const newUser = new User();
      newUser.email = email;
      newUser.name = name;

      if (adminEmail.includes(email)) {
        newUser.roles = [Role.User, Role.Admin];
      }

      return await this.usersRepository.save(newUser);
    }

    user.email = email;
    user.name = name;

    if (adminEmail.includes(email)) {
      user.roles = [...user.roles, Role.Admin];
    }

    return await this.usersRepository.save(user);
  }
}
