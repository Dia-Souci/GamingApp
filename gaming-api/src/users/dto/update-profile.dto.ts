import { IsOptional, IsString, IsDateString } from 'class-validator';
import { IsMediaUrl } from '../../common/validators/media-url.validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsMediaUrl('image')
  avatar?: string; // URL to avatar image

  @IsOptional()
  @IsMediaUrl('image')
  bannerImage?: string; // URL to banner image

  @IsOptional()
  @IsString()
  bio?: string; // User bio/description
}
