import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  // The reset token that was sent to the user after forgot password request.
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}