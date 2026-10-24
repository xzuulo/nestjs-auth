import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import type { User as UserType } from '../users/user.types.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { Role } from '../users/role.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    console.log(password);
    if (!user) {
      return null;
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(user: UserType) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const refreshTokenHash = this.hashToken(refreshToken);
    this.usersService.saveRefreshToken(user.id, refreshTokenHash);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async register(user: { email: string; password: string; role: Role }) {
    const createdUser = await this.usersService.createUser(user);
    return await this.login(createdUser);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(
          'Пользователь не найден [refreshTokens]',
        );
      }

      const refreshTokenHash = this.hashToken(refreshToken);
      if (refreshTokenHash !== user.refreshTokenHash) {
        throw new UnauthorizedException('Токен отозван');
      }

      return this.login(user);
    } catch {
      throw new UnauthorizedException('Refresh токен недействителен или истёк');
    }
  }

  async logout(userId: string) {
    this.usersService.clearRefreshToken(userId);
    return {
      success: true,
      details: 'Успешный выход из аккаунта',
    };
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
