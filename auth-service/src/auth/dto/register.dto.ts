import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  // Role defaults to resident when not provided.
  // Admin accounts should be created explicitly by passing role: admin.
  @IsEnum(['admin', 'resident'], { message: 'Role must be either admin or resident' })
  @IsOptional()
  role?: string;
}