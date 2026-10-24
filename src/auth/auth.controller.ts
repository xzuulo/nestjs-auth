import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decorator.js';
import type { User as UserType } from '../users/user.types.js';
import { AuthService } from './auth.service.js';
import { Roles } from './roles.decorator.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Role } from '../users/role.enum.js';
import { CreateUserDto } from '../users/dto/createUser.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@User() user: UserType) {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@User() user: UserType) {
    return user;
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Request() req: { user: { id: string } }) {
    return this.authService.logout(req.user.id);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  adminDashboard() {
    return { message: 'Admin dashboard' };
  }
}
