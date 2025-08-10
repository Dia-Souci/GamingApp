import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserDocument } from '../../users/schemas/user.schema';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'fallback-secret',
      algorithms: ['HS256'], // Explicitly specify allowed algorithms
      issuer: configService.get<string>('jwt.issuer') || 'gaming-api',
      audience: configService.get<string>('jwt.audience') || 'gaming-app',
    });
    
    const jwtSecret = this.configService.get<string>('jwt.secret');
    const jwtExpiresIn = this.configService.get<string>('jwt.expiresIn');
    const jwtIssuer = this.configService.get<string>('jwt.issuer');
    const jwtAudience = this.configService.get<string>('jwt.audience');
    
    this.logger.debug('JWT Strategy configuration', {
      hasSecret: !!jwtSecret,
      secretLength: jwtSecret?.length,
      expiresIn: jwtExpiresIn,
      issuer: jwtIssuer,
      audience: jwtAudience
    });
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    try {
      this.logger.debug('JWT validation started', { 
        sub: payload.sub, 
        email: payload.email, 
        role: payload.role 
      });

      // Validate payload structure
      if (!payload.sub || !payload.email || !payload.role) {
        this.logger.warn('Invalid JWT payload structure', { payload });
        throw new UnauthorizedException('Invalid token payload');
      }

      // Check if token is expired (should be handled by passport-jwt, but double-check)
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        this.logger.warn('JWT token expired', { userId: payload.sub, exp: payload.exp, currentTime });
        throw new UnauthorizedException('Token expired');
      }

      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        this.logger.warn('User not found for JWT payload', { userId: payload.sub });
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        this.logger.warn('Inactive user attempted authentication', { userId: payload.sub });
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify email matches (additional security check)
      if (user.email !== payload.email) {
        this.logger.warn('Email mismatch in JWT payload', { 
          payloadEmail: payload.email, 
          userEmail: user.email,
          userId: payload.sub 
        });
        throw new UnauthorizedException('Invalid token');
      }

      // Verify role matches (additional security check)
      if (user.role !== payload.role) {
        this.logger.warn('Role mismatch in JWT payload', { 
          payloadRole: payload.role, 
          userRole: user.role,
          userId: payload.sub 
        });
        throw new UnauthorizedException('Invalid token');
      }

      this.logger.debug('JWT validation successful', { 
        userId: payload.sub, 
        email: payload.email, 
        role: payload.role,
        userRole: user.role 
      });
      
      // Log the final user object that will be attached to the request
      this.logger.debug('User object attached to request', { 
        userId: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
      
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error('JWT validation error', { 
        error: error.message, 
        userId: payload?.sub,
        stack: error.stack 
      });
      throw new UnauthorizedException('Token validation failed');
    }
  }
}