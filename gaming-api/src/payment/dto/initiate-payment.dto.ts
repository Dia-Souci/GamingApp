import { IsString, IsNumber, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsUrl()
  @IsNotEmpty()
  successUrl: string;

  @IsUrl()
  @IsNotEmpty()
  failureUrl: string;
}

export class RefundPaymentDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class PaymentCallbackDto {
  @IsString()
  @IsNotEmpty()
  checkout_id: string;
}
