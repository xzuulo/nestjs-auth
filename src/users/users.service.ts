import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Role } from './role.enum.js';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  async get(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) throw new NotFoundException('Пользователя не существует');

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new NotFoundException('Пользователя не существует');

    return user;
  }

  async saveRefreshToken(userId: string, tokenHash: string): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, { refreshTokenHash: tokenHash });
    return await this.usersRepository.save(user);
  }

  async clearRefreshToken(userId: string) {
    const user = await this.findById(userId);
    Object.assign(user, { refreshTokenHash: undefined });
    return await this.usersRepository.save(user);
  }

  async createUser(user: { email: string; password: string; role: Role }) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const createdUser = this.usersRepository.create({
      email: user.email,
      passwordHash: passwordHash,
      role: user.role,
    });
    return await this.usersRepository.save(createdUser);
  }
}
