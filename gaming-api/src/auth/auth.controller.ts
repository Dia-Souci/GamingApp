import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { ForgotPasswordDto } from './dto/forgot-password.dto';
  import { ResetPasswordDto } from './dto/reset-password.dto';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { CurrentUser } from './decorators/current-user.decorator';
  import { AuthResponse } from './types/auth.types';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
        // POST /api/auth/register
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
      return this.authService.register(registerDto);
    }

    // POST /api/auth/login
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
      return this.authService.login(loginDto);
    }
  
    // GET /api/auth/profile
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@CurrentUser() user: any) {
      return {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        preferences: user.preferences,
        addresses: user.addresses,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
      };
    }
  
    // POST /api/auth/refresh
    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    async refresh(@CurrentUser() user: any) {
      return this.authService.refreshToken(user);
    }
  
    // POST /api/auth/forgot-password
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto.email);
    }
  
    // POST /api/auth/reset-password
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
    }
  
    // POST /api/auth/logout (client-side token removal)
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout() {
      return { message: 'Logged out successfully' };
    }
  }