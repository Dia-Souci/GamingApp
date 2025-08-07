import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min, Max } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  // Pricing
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  // Platform & Category
  @IsEnum(['pc', 'playstation', 'xbox', 'nintendo'])
  platform: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Media
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  screenshots?: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  // Game Details
  @IsOptional()
  @IsString()
  developer?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  // Status
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'out_of_stock'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}