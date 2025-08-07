export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-api',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
      origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
  });