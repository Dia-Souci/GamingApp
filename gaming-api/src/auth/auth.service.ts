import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { AuthResponse, JwtPayload } from './types/auth.types';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      this.logger.log('User registration attempt', { email: registerDto.email });

      const user = await this.usersService.create(registerDto);
      
      const payload: JwtPayload = { 
        email: user.email, 
        sub: user._id.toString(), 
        role: user.role 
      };
      
      const access_token = this.generateToken(payload);

      this.logger.log('User registered successfully', { userId: user._id.toString() });

      return {
        access_token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          profile: user.profile,
          isVerified: user.isVerified,
        },
      };
    } catch (error) {
      this.logger.error('Registration failed', { 
        error: error.message, 
        email: registerDto.email 
      });
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      this.logger.log('User login attempt', { email: loginDto.email });

      const user = await this.usersService.findByEmail(loginDto.email);
      
      if (!user) {
        this.logger.warn('Login attempt with non-existent email', { email: loginDto.email });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if account is locked
      if (await this.usersService.isAccountLocked(user)) {
        this.logger.warn('Login attempt on locked account', { userId: user._id.toString() });
        throw new UnauthorizedException('Account is temporarily locked due to too many failed login attempts');
      }

      // Validate password
      const isPasswordValid = await this.usersService.validatePassword(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        await this.usersService.incrementLoginAttempts(user._id.toString());
        this.logger.warn('Invalid password attempt', { userId: user._id.toString() });
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        this.logger.warn('Login attempt on deactivated account', { userId: user._id.toString() });
        throw new UnauthorizedException('Account is deactivated');
      }

      // Update last login
      await this.usersService.updateLastLogin(user._id.toString());

      const payload: JwtPayload = { 
        email: user.email, 
        sub: user._id.toString(), 
        role: user.role 
      };
      
      const access_token = this.generateToken(payload);

      this.logger.log('User logged in successfully', { userId: user._id.toString() });

      return {
        access_token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          profile: user.profile,
          isVerified: user.isVerified,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error('Login failed', { 
        error: error.message, 
        email: loginDto.email 
      });
      throw new UnauthorizedException('Login failed');
    }
  }

  async refreshToken(user: UserDocument): Promise<{ access_token: string }> {
    try {
      const payload: JwtPayload = { 
        email: user.email, 
        sub: user._id.toString(), 
        role: user.role 
      };
      
      const access_token = this.generateToken(payload);

      this.logger.log('Token refreshed successfully', { userId: user._id.toString() });

      return { access_token };
    } catch (error) {
      this.logger.error('Token refresh failed', { 
        error: error.message, 
        userId: user._id.toString() 
      });
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    try {
      this.logger.log('Password reset request', { email });

      const user = await this.usersService.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        this.logger.log('Password reset request for non-existent email', { email });
        return { message: 'If an account with that email exists, a password reset link has been sent.' };
      }

      // Generate cryptographically secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with reset token
      await this.usersService.setPasswordResetToken(email, resetToken, resetTokenExpires);

      this.logger.log('Password reset token generated', { userId: user._id.toString() });

      // TODO: Send email with reset token
      // For now, we'll just return the token (remove this in production)
      return {
        message: 'Password reset link has been sent to your email.',
        resetToken, // Remove this in production
      };
    } catch (error) {
      this.logger.error('Password reset request failed', { 
        error: error.message, 
        email 
      });
      throw new BadRequestException('Failed to process password reset request');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      this.logger.log('Password reset attempt', { token: token.substring(0, 8) + '...' });

      if (!token || !newPassword) {
        throw new BadRequestException('Token and new password are required');
      }

      // Validate password strength
      if (newPassword.length < 8) {
        throw new BadRequestException('Password must be at least 8 characters long');
      }

      const user = await this.usersService.findByResetToken(token);
      
      if (!user) {
        this.logger.warn('Password reset with invalid token', { token: token.substring(0, 8) + '...' });
        throw new BadRequestException('Invalid or expired reset token');
      }

      if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        this.logger.warn('Password reset with expired token', { userId: user._id.toString() });
        throw new BadRequestException('Reset token has expired');
      }

      await this.usersService.updatePassword(user._id.toString(), newPassword);

      this.logger.log('Password reset successful', { userId: user._id.toString() });

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Password reset failed', { 
        error: error.message, 
        token: token?.substring(0, 8) + '...' 
      });
      throw new BadRequestException('Failed to reset password');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (user && await this.usersService.validatePassword(password, user.password)) {
        const { password: userPassword, ...result } = user.toObject();
        return result;
      }
      
      return null;
    } catch (error) {
      this.logger.error('User validation failed', { 
        error: error.message, 
        email 
      });
      return null;
    }
  }

  private generateToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>('jwt.expiresIn') || '24h';
    
    return this.jwtService.sign(payload, {
      expiresIn,
      issuer: 'gaming-api',
      audience: 'gaming-app',
    });
  }
}