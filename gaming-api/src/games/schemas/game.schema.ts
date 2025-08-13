import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  longDescription: string;

  // Pricing
  @Prop({ required: true })
  originalPrice: number;

  @Prop()
  discountedPrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 'DZD' })
  currency: string;

  // Platform & Category
  @Prop({ required: true, enum: ['pc', 'playstation', 'xbox', 'nintendo'] })
  platform: string;

  @Prop([String])
  platforms: string[];

  @Prop([String])
  genre: string[];

  @Prop([String])
  tags: string[];

  // Media
  @Prop()
  imageUrl: string;

  @Prop()
  heroImageUrl: string;

  @Prop([String])
  screenshots: string[];

  @Prop()
  videoUrl: string;

  @Prop()
  trailerUrl: string; // Game trailer video URL

  @Prop([String])
  galleryImages: string[]; // Additional gallery images

  @Prop()
  coverImageUrl: string; // Game cover image URL

  @Prop()
  iconUrl: string; // Game icon/logo URL

  // Game Details
  @Prop()
  developer: string;

  @Prop()
  publisher: string;

  @Prop()
  releaseDate: Date;

  @Prop()
  deliveryMethod: string;

  // System Requirements (simplified for now)
  @Prop({ type: Object })
  systemRequirements: {
    minimum: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    recommended: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
  };

  // Reviews & Ratings
  @Prop({ default: 0 })
  reviewScore: number;

  @Prop({ default: 0 })
  totalReviews: number;

  // Inventory & Status
  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'out_of_stock'] })
  status: string;

  @Prop({ default: false })
  featured: boolean;

  // Analytics
  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  purchaseCount: number;

  // SEO
  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop([String])
  keywords: string[];

  // Activation Keys for Digital Games
  @Prop([{
    key: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
    usedAt: { type: Date },
  }])
  activationKeys: Array<{
    key: string;
    isUsed: boolean;
    addedAt: Date;
    usedAt?: Date;
  }>;
}

export const GameSchema = SchemaFactory.createForClass(Game);

// Add indexes for better query performance
GameSchema.index({ platform: 1, status: 1 });
GameSchema.index({ title: 'text', description: 'text', tags: 'text' });
GameSchema.index({ featured: 1, createdAt: -1 });
GameSchema.index({ slug: 1 }, { unique: true });