import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebsiteSettings, WebsiteSettingsDocument } from './schemas/website-settings.schema';
import { CreateWebsiteSettingsDto } from './dto/create-website-settings.dto';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';

@Injectable()
export class WebsiteSettingsService {
  constructor(
    @InjectModel(WebsiteSettings.name) private websiteSettingsModel: Model<WebsiteSettingsDocument>,
  ) {}

  async create(createWebsiteSettingsDto: CreateWebsiteSettingsDto): Promise<WebsiteSettings> {
    // Check if settings already exist
    const existingSettings = await this.websiteSettingsModel.findOne().exec();
    if (existingSettings) {
      throw new Error('Website settings already exist. Use update instead.');
    }

    const createdSettings = new this.websiteSettingsModel({
      ...createWebsiteSettingsDto,
      name: createWebsiteSettingsDto.name || 'main',
    });
    return createdSettings.save();
  }

  async findOne(): Promise<WebsiteSettings> {
    const settings = await this.websiteSettingsModel.findOne().exec();
    if (!settings) {
      // Return default settings if none exist
      return {
        name: 'main',
        heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
        displayedCategories: ['pc', 'playstation', 'xbox', 'nintendo'],
        featuredGame: null,
        isActive: true,
      } as WebsiteSettings;
    }
    return settings;
  }

  async update(updateWebsiteSettingsDto: UpdateWebsiteSettingsDto): Promise<WebsiteSettings> {
    const settings = await this.websiteSettingsModel.findOne().exec();
    
    if (!settings) {
      // Create new settings if none exist
      return this.create(updateWebsiteSettingsDto as CreateWebsiteSettingsDto);
    }

    const updatedSettings = await this.websiteSettingsModel
      .findOneAndUpdate({}, updateWebsiteSettingsDto, { new: true })
      .exec();
      
    if (!updatedSettings) {
      throw new NotFoundException('Website settings not found');
    }
    
    return updatedSettings;
  }

  async setFeaturedGame(gameId: string | null): Promise<WebsiteSettings> {
    const settings = await this.websiteSettingsModel.findOne().exec();
    
    if (!settings) {
      // Create new settings if none exist
      return this.create({
        heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
        displayedCategories: ['pc', 'playstation', 'xbox', 'nintendo'],
        featuredGame: gameId,
      });
    }

    const updatedSettings = await this.websiteSettingsModel
      .findOneAndUpdate({}, { featuredGame: gameId }, { new: true })
      .exec();
      
    if (!updatedSettings) {
      throw new NotFoundException('Website settings not found');
    }
    
    return updatedSettings;
  }

  async remove(): Promise<void> {
    const result = await this.websiteSettingsModel.deleteOne().exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Website settings not found');
    }
  }
}
