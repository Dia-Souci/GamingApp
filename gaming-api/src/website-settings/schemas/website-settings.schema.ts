import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebsiteSettingsDocument = WebsiteSettings & Document;

@Schema({ timestamps: true })
export class WebsiteSettings {
  @Prop({ required: true, unique: true, default: 'main' })
  name: string;

  @Prop({ required: true })
  heroImageUrl: string;

  @Prop({ type: [String], required: true, default: ['pc', 'playstation', 'xbox', 'nintendo'] })
  displayedCategories: string[];

  @Prop({ type: String, default: null })
  featuredGame: string | null;

  @Prop({ default: true })
  isActive: boolean;
}

export const WebsiteSettingsSchema = SchemaFactory.createForClass(WebsiteSettings);
