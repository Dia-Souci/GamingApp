import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsiteSettingsService } from './website-settings.service';
import { WebsiteSettingsController } from './website-settings.controller';
import { WebsiteSettings, WebsiteSettingsSchema } from './schemas/website-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebsiteSettings.name, schema: WebsiteSettingsSchema },
    ]),
  ],
  controllers: [WebsiteSettingsController],
  providers: [WebsiteSettingsService],
  exports: [WebsiteSettingsService],
})
export class WebsiteSettingsModule {}
