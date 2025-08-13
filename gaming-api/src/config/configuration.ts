export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-api',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  payment: {
    chargily: {
      apiKey: process.env.CHARGILY_API_KEY,
      mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      webhookSecret: process.env.CHARGILY_WEBHOOK_SECRET,
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});