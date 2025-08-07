import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  quantity: number;
}