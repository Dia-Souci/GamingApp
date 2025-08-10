import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: any) {
    this.logger.debug('JWT Auth Guard - handleRequest', {
      hasError: !!err,
      hasUser: !!user,
      userRole: user?.role,
      userId: user?._id,
      info: info?.message || info,
      path: context.switchToHttp().getRequest().url
    });

    if (err) {
      this.logger.error('JWT Auth Guard - Authentication error', { error: err.message });
    }

    if (!user) {
      this.logger.warn('JWT Auth Guard - No user found', { info: info?.message || info });
    }

    return super.handleRequest(err, user, info, context);
  }
}