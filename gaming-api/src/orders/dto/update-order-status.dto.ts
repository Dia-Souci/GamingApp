import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'confirmed', 'processing', 'delivered', 'cancelled', 'refunded'])
  status: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'refunded'])
  paymentStatus: string;
}