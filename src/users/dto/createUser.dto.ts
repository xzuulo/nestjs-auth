import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../role.enum.js';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}
