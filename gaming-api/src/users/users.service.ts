import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: any): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
      profile: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
      },
      preferences: {
        newsletter: false,
        notifications: true,
      },
    });

    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).exec();
  }

  async findAll(query: any = {}): Promise<UserDocument[]> {
    const { role, page = 1, limit = 20 } = query;
    const filter: any = {};

    if (role) {
      filter.role = role;
    }

    const skip = (page - 1) * limit;

    return this.userModel
      .find(filter)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateProfile(id: string, updateData: any): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { profile: { ...updateData } } },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      lastLogin: new Date(),
      loginAttempts: 0,
      lockedUntil: null,
    });
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (user) {
      const attempts = user.loginAttempts + 1;
      const updateData: any = { loginAttempts: attempts };

      // Lock account after 5 failed attempts for 30 minutes
      if (attempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      await this.userModel.findByIdAndUpdate(id, updateData);
    }
  }

  async isAccountLocked(user: UserDocument): Promise<boolean> {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return true;
    }
    return false;
  }

  async setPasswordResetToken(email: string, token: string, expires: Date): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      {
        passwordResetToken: token,
        passwordResetExpires: expires,
      }
    );
  }

  async deactivateUser(id: string): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }
}