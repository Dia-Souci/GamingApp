import { Game } from '../types/game';

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'The Witcher 3: Wild Hunt',
    platform: 'pc',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&auto=format&fit=crop&q=60',
    description: 'An epic open-world RPG with a compelling story and memorable characters.',
    tags: ['RPG', 'Open World', 'Action', 'Fantasy'],
    reviewScore: 9.3,
    totalReviews: 89234,
    developer: 'CD PROJEKT RED',
    publisher: 'CD PROJEKT RED',
    genre: ['Action', 'RPG', 'Fantasy'],
    releaseDate: '2015-05-19',
    activationInstructions: 'A Steam account is required for game activation and installation.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 89
  },
  {
    id: '2',
    title: 'God of War Ragnarök',
    platform: 'playstation',
    originalPrice: 69.99,
    discountedPrice: 49.99,
    discount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop&q=60',
    description: 'Kratos and Atreus embark on a mythic journey through the Nine Realms.',
    tags: ['Action', 'Adventure', 'Mythology'],
    reviewScore: 9.4,
    totalReviews: 123456,
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Adventure', 'Mythology'],
    releaseDate: '2022-11-09',
    activationInstructions: 'PlayStation Network account required.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 234
  },
  {
    id: '3',
    title: 'Halo Infinite',
    platform: 'xbox',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&auto=format&fit=crop&q=60',
    description: 'The legendary Halo series returns with the most expansive Master Chief campaign yet.',
    tags: ['FPS', 'Action', 'Sci-Fi'],
    reviewScore: 8.5,
    totalReviews: 45678,
    developer: '343 Industries',
    publisher: 'Xbox Game Studios',
    genre: ['FPS', 'Action', 'Sci-Fi'],
    releaseDate: '2021-12-08',
    activationInstructions: 'Xbox Live account required.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 156
  },
  {
    id: '4',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    platform: 'nintendo',
    originalPrice: 59.99,
    discountedPrice: 54.99,
    discount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop&q=60',
    description: 'Link\'s adventure continues in this highly anticipated sequel to Breath of the Wild.',
    tags: ['Adventure', 'Action', 'Open World'],
    reviewScore: 9.5,
    totalReviews: 98765,
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Action', 'Adventure', 'Open World'],
    releaseDate: '2023-05-12',
    activationInstructions: 'Nintendo Account required.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 445
  },
  {
    id: '5',
    title: 'Cyberpunk 2077',
    platform: 'pc',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&auto=format&fit=crop&q=60',
    description: 'An open-world action RPG set in the futuristic Night City.',
    tags: ['RPG', 'Open World', 'Cyberpunk'],
    reviewScore: 8.2,
    totalReviews: 34567,
    developer: 'CD PROJEKT RED',
    publisher: 'CD PROJEKT RED',
    genre: ['Action', 'RPG', 'Cyberpunk'],
    releaseDate: '2020-12-10',
    activationInstructions: 'A Steam account is required for game activation and installation.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 203
  },
  {
    id: '6',
    title: 'Spider-Man 2',
    platform: 'playstation',
    originalPrice: 69.99,
    discountedPrice: 59.99,
    discount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop&q=60',
    description: 'Swing through New York as both Peter Parker and Miles Morales.',
    tags: ['Action', 'Adventure', 'Superhero'],
    reviewScore: 9.2,
    totalReviews: 76543,
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Adventure', 'Superhero'],
    releaseDate: '2023-10-20',
    activationInstructions: 'PlayStation Network account required.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 198
  },
  {
    id: '7',
    title: 'Forza Horizon 5',
    platform: 'xbox',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&auto=format&fit=crop&q=60',
    description: 'Experience the vibrant open world of Mexico in this racing masterpiece.',
    tags: ['Racing', 'Open World', 'Sports'],
    reviewScore: 8.9,
    totalReviews: 67890,
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    genre: ['Racing', 'Open World', 'Sports'],
    releaseDate: '2021-11-09',
    activationInstructions: 'Xbox Live account required.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 123
  },
  {
    id: '8',
    title: 'Super Mario Bros. Wonder',
    platform: 'nintendo',
    originalPrice: 59.99,
    discountedPrice: 54.99,
    discount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
    heroImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop&q=60',
    description: 'Join Mario and friends in this new 2D platforming adventure.',
    tags: ['Platformer', 'Family', 'Adventure'],
    reviewScore: 9.0,
    totalReviews: 45678,
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Platformer', 'Family', 'Adventure'],
    releaseDate: '2023-10-20',
    activationInstructions: 'Nintendo Account required.',
    inStock: true,
    deliveryMethod: 'Digital Download',
    usersOnPage: 167
  }
  // Add more games to reach 120+ total...
];

// Helper function to get games by platform
export const getGamesByPlatform = (platform: string): Game[] => {
  return mockGames.filter(game => game.platform === platform);
};

// Helper function to search games
export const searchGames = (query: string, platform?: string): Game[] => {
  const searchTerm = query.toLowerCase();
  return mockGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm);
    const matchesPlatform = !platform || game.platform === platform;
    return matchesSearch && matchesPlatform;
  });
};

// Helper function to get paginated games
export const getPaginatedGames = (
  games: Game[],
  page: number,
  itemsPerPage: number = 30
): Game[] => {
  const startIndex = (page - 1) * itemsPerPage;
  return games.slice(startIndex, startIndex + itemsPerPage);
}; 