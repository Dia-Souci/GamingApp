import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { IsMediaUrl, IsMediaUrlArray } from '../../common/validators/media-url.validator';

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

  // Media - All fields now use custom media URL validation
  @IsOptional()
  @IsMediaUrl('image')
  imageUrl?: string;

  @IsOptional()
  @IsMediaUrl('image')
  heroImageUrl?: string;

  @IsOptional()
  @IsMediaUrlArray('image')
  screenshots?: string[];

  @IsOptional()
  @IsMediaUrl('video')
  videoUrl?: string;

  @IsOptional()
  @IsMediaUrl('video')
  trailerUrl?: string; // Game trailer video URL

  @IsOptional()
  @IsMediaUrlArray('image')
  galleryImages?: string[]; // Additional gallery images

  @IsOptional()
  @IsMediaUrl('image')
  coverImageUrl?: string; // Game cover image URL

  @IsOptional()
  @IsMediaUrl('image')
  iconUrl?: string; // Game icon/logo URL

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