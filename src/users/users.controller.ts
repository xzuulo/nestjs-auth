import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { CreateUserDto } from './dto/createUser.dto.js';

@Controller('users')
export class UsersController {
  constructor(public readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.get();
  }
}
