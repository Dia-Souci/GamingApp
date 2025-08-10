export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-api',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: process.env.JWT_ISSUER || 'gaming-api',
      audience: process.env.JWT_AUDIENCE || 'gaming-app',
    },
    cors: {
      origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
    media: {
      // Allowed media file extensions for URL validation
      allowedImageExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      allowedVideoExtensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
      // Maximum URL length for media fields
      maxUrlLength: 2048,
      // CDN base URLs (optional, for frontend reference)
      cdnBaseUrl: process.env.CDN_BASE_URL || 'https://cdn.example.com',
    },
  });