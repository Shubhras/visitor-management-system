import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVisitorDto {
  @IsString()
  @IsNotEmpty({ message: 'Visitor name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Unit number is required' })
  unitNumber: string;

  // We expect an ISO date string like 2024-12-25 from the client.
  @IsDateString({}, { message: 'Visit date must be a valid date string' })
  visitDate: string;

  // The ID of the user who is registering this visitor.
  // The gateway extracts this from the JWT token and injects it
  // into the payload before forwarding to this service.
  @IsNumber()
  createdBy: number;
}