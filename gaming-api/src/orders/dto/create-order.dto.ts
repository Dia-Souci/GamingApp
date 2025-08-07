import { IsNotEmpty, IsString, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  wilaya: string;

  @IsNotEmpty()
  @IsString()
  wilayaName: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  extraInfo: string;

  @IsOptional()
  @IsString()
  paymentMethod: string = 'pending';
}