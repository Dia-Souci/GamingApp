import { validate } from 'class-validator';
import { IsMediaUrl, IsMediaUrlArray } from './media-url.validator';

// Test class for single URL validation
class TestImageDto {
  @IsMediaUrl('image')
  imageUrl?: string;
}

class TestVideoDto {
  @IsMediaUrl('video')
  videoUrl?: string;
}

// Test class for array validation
class TestImageArrayDto {
  @IsMediaUrlArray('image')
  images?: string[];
}

class TestVideoArrayDto {
  @IsMediaUrlArray('video')
  videos?: string[];
}

describe('Media URL Validators', () => {
  describe('IsMediaUrl - Image', () => {
    it('should validate valid image URLs', async () => {
      const dto = new TestImageDto();
      dto.imageUrl = 'https://example.com/image.jpg';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid image extensions', async () => {
      const dto = new TestImageDto();
      dto.imageUrl = 'https://example.com/image.txt';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isMediaUrl).toBeDefined();
    });

    it('should reject non-HTTP/HTTPS URLs', async () => {
      const dto = new TestImageDto();
      dto.imageUrl = 'ftp://example.com/image.jpg';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });

    it('should allow optional fields', async () => {
      const dto = new TestImageDto();
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsMediaUrl - Video', () => {
    it('should validate valid video URLs', async () => {
      const dto = new TestVideoDto();
      dto.videoUrl = 'https://example.com/video.mp4';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid video extensions', async () => {
      const dto = new TestVideoDto();
      dto.videoUrl = 'https://example.com/video.txt';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('IsMediaUrlArray - Image', () => {
    it('should validate valid image URL arrays', async () => {
      const dto = new TestImageArrayDto();
      dto.images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.png'
      ];
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject arrays with invalid URLs', async () => {
      const dto = new TestImageArrayDto();
      dto.images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.txt' // Invalid extension
      ];
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });

    it('should allow optional fields', async () => {
      const dto = new TestImageArrayDto();
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsMediaUrlArray - Video', () => {
    it('should validate valid video URL arrays', async () => {
      const dto = new TestVideoArrayDto();
      dto.videos = [
        'https://example.com/video1.mp4',
        'https://example.com/video2.avi'
      ];
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
