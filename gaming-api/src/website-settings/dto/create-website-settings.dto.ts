import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateWebsiteSettingsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  heroImageUrl: string;

  @IsArray()
  @IsString({ each: true })
  displayedCategories: string[];

  @IsString()
  @IsOptional()
  featuredGame?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
