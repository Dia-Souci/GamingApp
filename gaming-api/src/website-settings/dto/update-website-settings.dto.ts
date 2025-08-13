import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsiteSettingsDto } from './create-website-settings.dto';

export class UpdateWebsiteSettingsDto extends PartialType(CreateWebsiteSettingsDto) {}
