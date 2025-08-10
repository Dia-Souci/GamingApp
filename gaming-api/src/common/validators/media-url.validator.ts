import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ConfigService } from '@nestjs/config';

export function IsMediaUrl(
  mediaType: 'image' | 'video',
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMediaUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional fields
          
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          if (!mediaConfig) {
            // If no config, fall back to basic URL validation
            return typeof value === 'string' && value.length > 0;
          }
          
          // Check URL length
          if (value.length > mediaConfig.maxUrlLength) {
            return false;
          }
          
          // Basic URL format validation
          try {
            const url = new URL(value);
            
            // Security checks
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
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
            return `${args.property} must be a valid image URL with extensions: ${mediaConfig?.allowedImageExtensions?.join(', ')}`;
          } else if (mediaType === 'video') {
            return `${args.property} must be a valid video URL with extensions: ${mediaConfig?.allowedVideoExtensions?.join(', ')}`;
          }
          
          return `${args.property} must be a valid ${mediaType} URL`;
        }
      }
    });
  };
}

export function IsMediaUrlArray(
  mediaType: 'image' | 'video',
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMediaUrlArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional fields
          
          if (!Array.isArray(value)) return false;
          
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          if (!mediaConfig) {
            // If no config, fall back to basic array validation
            return value.every(item => typeof item === 'string' && item.length > 0);
          }
          
          return value.every(url => {
            // Check URL length
            if (url.length > mediaConfig.maxUrlLength) {
              return false;
            }
            
            // Check file extension
            try {
              const urlObj = new URL(url);
              
              // Security checks
              if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                return false;
              }
              
              const pathname = urlObj.pathname.toLowerCase();
              const extension = pathname.split('.').pop();
              
              if (!extension) return false;
              
              if (mediaType === 'image') {
                return mediaConfig.allowedImageExtensions.includes(extension);
              } else if (mediaType === 'video') {
                return mediaConfig.allowedVideoExtensions.includes(extension);
              }
            } catch {
              return false;
            }
            
            return false;
          });
        },
        defaultMessage(args: ValidationArguments) {
          const configService = new ConfigService();
          const mediaConfig = configService.get('media');
          
          if (mediaType === 'image') {
            return `${args.property} must be an array of valid image URLs with extensions: ${mediaConfig?.allowedImageExtensions?.join(', ')}`;
          } else if (mediaType === 'video') {
            return `${args.property} must be an array of valid video URLs with extensions: ${mediaConfig?.allowedVideoExtensions?.join(', ')}`;
          }
          
          return `${args.property} must be an array of valid ${mediaType} URLs`;
        }
      }
    });
  };
}

// Additional validator for checking if URLs are from allowed domains
export function IsAllowedDomain(
  allowedDomains: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAllowedDomain',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional fields
          
          try {
            const url = new URL(value);
            const hostname = url.hostname.toLowerCase();
            
            return allowedDomains.some(domain => 
              hostname === domain.toLowerCase() || 
              hostname.endsWith('.' + domain.toLowerCase())
            );
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be from an allowed domain: ${allowedDomains.join(', ')}`;
        }
      }
    });
  };
}
