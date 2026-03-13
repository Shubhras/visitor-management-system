import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../roles/role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  // Role defaults to resident if not provided, since most new accounts
  // will be mobile app users rather than admin dashboard users.
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}