import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ConfigService } from '@nestjs/config';

// Advanced media URL validator with security checks
export function IsSecureMediaUrl(
  mediaType: 'image' | 'video',
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSecureMediaUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional fields
          
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          if (!mediaConfig) {
            return typeof value === 'string' && value.length > 0;
          }
          
          // Check URL length
          if (value.length > mediaConfig.maxUrlLength) {
            return false;
          }
          
          try {
            const url = new URL(value);
            
            // Enhanced security checks
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              return false;
            }
            
            // Check for suspicious patterns
            const suspiciousPatterns = [
              /javascript:/i,
              /data:/i,
              /vbscript:/i,
              /on\w+\s*=/i, // Event handlers
            ];
            
            if (suspiciousPatterns.some(pattern => pattern.test(value))) {
              return false;
            }
            
            // Check file extension
            const pathname = url.pathname.toLowerCase();
            const extension = pathname.split('.').pop();
            
            if (!extension) return false;
            
            if (mediaType === 'image') {
              return mediaConfig.allowedImageExtensions.includes(extension);
            } else if (mediaType === 'video') {
              return mediaConfig.allowedVideoExtensions.includes(extension);
            }
            
            return false;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          if (args.value && args.value.length > mediaConfig?.maxUrlLength) {
            return `${args.property} URL is too long. Maximum length is ${mediaConfig.maxUrlLength} characters.`;
          }
          
          if (mediaType === 'image') {
            return `${args.property} must be a secure image URL with extensions: ${mediaConfig?.allowedImageExtensions?.join(', ')}`;
          } else if (mediaType === 'video') {
            return `${args.property} must be a secure video URL with extensions: ${mediaConfig?.allowedVideoExtensions?.join(', ')}`;
          }
          
          return `${args.property} must be a secure ${mediaType} URL`;
        }
      }
    });
  };
}

// Validator for checking if URLs are from trusted CDN domains
export function IsTrustedCDN(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTrustedCDN',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional fields
          
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          if (!mediaConfig?.cdnBaseUrl) {
            return true; // If no CDN config, allow all URLs
          }
          
          try {
            const url = new URL(value);
            const cdnUrl = new URL(mediaConfig.cdnBaseUrl);
            
            // Check if URL is from the configured CDN domain
            return url.hostname === cdnUrl.hostname || 
                   url.hostname.endsWith('.' + cdnUrl.hostname);
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          return `${args.property} must be from the trusted CDN: ${mediaConfig?.cdnBaseUrl || 'configured CDN'}`;
        }
      }
    });
  };
}

// Validator for checking URL accessibility (basic check)
export function IsAccessibleUrl(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAccessibleUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional fields
          
          try {
            const url = new URL(value);
            
            // Basic accessibility checks
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              return false;
            }
            
            // Check for localhost or private IP ranges (development only)
            const hostname = url.hostname.toLowerCase();
            if (hostname === 'localhost' || 
                hostname === '127.0.0.1' || 
                hostname.startsWith('192.168.') ||
                hostname.startsWith('10.') ||
                hostname.startsWith('172.')) {
              return true; // Allow local development URLs
            }
            
            // For production, you might want to add more checks here
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an accessible URL`;
        }
      }
    });
  };
}
