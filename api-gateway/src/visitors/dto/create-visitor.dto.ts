import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateVisitorDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+601234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'A-12-3' })
  @IsString()
  @IsNotEmpty()
  unitNumber: string;

  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  visitDate: string;
}