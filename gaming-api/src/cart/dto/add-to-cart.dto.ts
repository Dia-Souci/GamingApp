import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  gameId: string;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  quantity: number = 1;
}