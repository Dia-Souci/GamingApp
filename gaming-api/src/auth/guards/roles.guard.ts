import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      this.logger.debug('No roles required, allowing access');
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    this.logger.debug('Role check', { 
      requiredRoles, 
      userRole: user?.role, 
      userId: user?._id,
      hasUser: !!user 
    });
    
    // Check if user exists and has a role
    if (!user || !user.role) {
      this.logger.warn('Access denied: User not found or missing role', { 
        hasUser: !!user, 
        userRole: user?.role 
      });
      return false;
    }
    
    // Check if user's role matches any of the required roles
    const hasAccess = requiredRoles.includes(user.role);
    
    if (!hasAccess) {
      this.logger.warn('Access denied: Insufficient role', { 
        requiredRoles, 
        userRole: user.role,
        userId: user._id 
      });
    } else {
      this.logger.debug('Access granted', { 
        requiredRoles, 
        userRole: user.role,
        userId: user._id 
      });
    }
    
    return hasAccess;
  }
}