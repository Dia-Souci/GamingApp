export interface Game {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  platform: string;
  imageUrl: string;
  heroImageUrl: string;
  description: string;
  tags: string[];
  reviewScore: number;
  totalReviews: number;
  developer: string;
  publisher: string;
  genre: string[];
  releaseDate: string;
  activationInstructions: string;
  inStock: boolean;
  deliveryMethod: string;
  usersOnPage: number;
} 