import { IsDateString, IsOptional, IsString } from 'class-validator';

// Only the basic fields are updatable by a resident.
// Status changes go through the dedicated approve and reject methods.
export class UpdateVisitorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  unitNumber?: string;

  @IsDateString()
  @IsOptional()
  visitDate?: string;
}