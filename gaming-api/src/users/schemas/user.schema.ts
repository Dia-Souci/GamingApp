import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['customer', 'admin', 'super_admin'], default: 'customer' })
  role: string;

  // Profile Information
  @Prop({ type: Object })
  profile: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    avatar?: string;
  };

  // Address Information for Algerian customers
  @Prop([{
    type: {
      type: String, // 'billing', 'shipping'
      wilaya: String, // Algerian province code
      wilayaName: String,
      address: String,
      city: String,
      postalCode: String,
      isDefault: Boolean,
    }
  }])
  addresses: Array<{
    type: string;
    wilaya: string;
    wilayaName: string;
    address: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
  }>;

  // Preferences
  @Prop({ type: Object })
  preferences: {
    platforms?: string[]; // Preferred gaming platforms
    genres?: string[]; // Preferred game genres
    newsletter?: boolean;
    notifications?: boolean;
  };

  // Account Status
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  emailVerifiedAt: Date;

  // Security
  @Prop()
  lastLogin: Date;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockedUntil: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  // Timestamps (automatically added by Mongoose)
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ passwordResetExpires: 1 });