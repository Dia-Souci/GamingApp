<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Media Management

This API uses a **URL-based approach** for all media files (images, videos, etc.) instead of file uploads. This simplifies the frontend implementation and provides better scalability.

### Media Fields

#### Games
- `imageUrl`: Main game image URL
- `heroImageUrl`: Hero/banner image URL  
- `coverImageUrl`: Game cover image URL
- `iconUrl`: Game icon/logo URL
- `screenshots`: Array of screenshot URLs
- `galleryImages`: Array of additional gallery image URLs
- `videoUrl`: Gameplay video URL
- `trailerUrl`: Game trailer video URL

#### Users
- `avatar`: Profile picture URL
- `bannerImage`: Profile banner image URL

#### Cart & Orders
- `imageUrl`: Game image URL for display
- `iconUrl`: Game icon URL
- `coverImageUrl`: Game cover image URL

### URL Validation

All media fields use **custom validation** that ensures:
- ✅ **Valid URL format** with proper protocol (http/https)
- ✅ **Allowed file extensions** (images: jpg, jpeg, png, gif, webp, svg | videos: mp4, avi, mov, wmv, flv, webm)
- ✅ **Maximum URL length** (2048 characters by default)
- ✅ **Security checks** (only http/https protocols allowed)

The frontend should:

1. **Store media files** on a CDN, cloud storage, or file hosting service
2. **Generate URLs** for the stored files
3. **Send URLs** to the API instead of file uploads
4. **Handle media display** by using the returned URLs

### Example Usage

```typescript
// Creating a game with media URLs
const gameData = {
  title: "Cyberpunk 2077",
  imageUrl: "https://cdn.example.com/games/cyberpunk-2077/main.jpg",
  heroImageUrl: "https://cdn.example.com/games/cyberpunk-2077/hero.jpg",
  videoUrl: "https://cdn.example.com/games/cyberpunk-2077/gameplay.mp4",
  trailerUrl: "https://cdn.example.com/games/cyberpunk-2077/trailer.mp4",
  // ... other fields
};

// Updating user profile with avatar
const profileData = {
  firstName: "John",
  lastName: "Doe",
  avatar: "https://cdn.example.com/avatars/john-doe.jpg",
  bannerImage: "https://cdn.example.com/banners/john-doe-banner.jpg"
};
```

### Validation Configuration

The validation rules are configurable via environment variables:

```typescript
// src/config/configuration.ts
media: {
  allowedImageExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  allowedVideoExtensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
  maxUrlLength: 2048,
  cdnBaseUrl: 'https://cdn.example.com'
}
```

### Benefits

- ✅ **Simplified Frontend**: No need for file upload handling
- ✅ **Better Performance**: URLs can be cached and served from CDNs
- ✅ **Scalability**: Media files can be distributed globally
- ✅ **Flexibility**: Easy to change media without API changes
- ✅ **Advanced Validation**: Custom validation ensures data integrity and security

## Project setup

```bash
$ npm install
```