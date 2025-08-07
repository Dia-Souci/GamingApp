import { create } from 'zustand';
import { gameApi } from '../services/gameApi';

export interface Game {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  platform: 'pc' | 'playstation' | 'xbox' | 'nintendo';
  imageUrl: string;
  heroImageUrl: string;
  description: string;
  developer: string;
  publisher: string;
  genre: string[];
  releaseDate: string;
  tags: string[];
  reviewScore: number;
  totalReviews: number;
  deliveryMethod: string;
  usersOnPage: number;
  activationInstructions: string;
}

interface GameStore {
  games: Game[];
  filteredGames: Game[];
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  selectedPlatform: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGames: (games: Game[]) => void;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterGames: () => void;
  getGameById: (id: string) => Game | undefined;
  getPaginatedGames: () => Game[];
  getTotalPages: () => number;
  resetFilters: () => void;
  
  // API Actions
  fetchGames: () => Promise<void>;
  fetchGameById: (id: string) => Promise<Game | null>;
  searchGames: (query: string, platform?: string) => Game[];
}

// Realistic mock game data sourced from popular games
const mockGames: Game[] = [
  // PC Games
  {
    id: '1',
    title: 'Cyberpunk 2077',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamour, and ceaseless body modification.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    genre: ['RPG', 'Action', 'Open World'],
    releaseDate: 'December 10, 2020',
    tags: ['Cyberpunk', 'Open World', 'RPG', 'Futuristic', 'Story Rich'],
    reviewScore: 7.8,
    totalReviews: 125000,
    deliveryMethod: 'Steam Key',
    usersOnPage: 1247,
    activationInstructions: 'Download and install Steam. Log into your Steam account. Click "Add a Game" and select "Activate a Product on Steam". Enter your key and follow the instructions.'
  },
  {
    id: '2',
    title: 'The Witcher 3: Wild Hunt',
    originalPrice: 39.99,
    discountedPrice: 9.99,
    discount: 75,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    genre: ['RPG', 'Action', 'Open World'],
    releaseDate: 'May 19, 2015',
    tags: ['Fantasy', 'Open World', 'RPG', 'Story Rich', 'Medieval'],
    reviewScore: 9.3,
    totalReviews: 89000,
    deliveryMethod: 'Steam Key',
    usersOnPage: 892,
    activationInstructions: 'Download and install Steam. Log into your Steam account. Click "Add a Game" and select "Activate a Product on Steam". Enter your key and follow the instructions.'
  },
  {
    id: '3',
    title: 'Red Dead Redemption 2',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee.',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    genre: ['Action', 'Adventure', 'Open World'],
    releaseDate: 'November 5, 2019',
    tags: ['Western', 'Open World', 'Story Rich', 'Action', 'Adventure'],
    reviewScore: 8.9,
    totalReviews: 67000,
    deliveryMethod: 'Rockstar Games Launcher',
    usersOnPage: 543,
    activationInstructions: 'Download and install the Rockstar Games Launcher. Create or log into your Rockstar account. Enter your activation code when prompted.'
  },
  {
    id: '4',
    title: 'Grand Theft Auto V',
    originalPrice: 29.99,
    discountedPrice: 14.99,
    discount: 50,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    genre: ['Action', 'Adventure', 'Open World'],
    releaseDate: 'April 14, 2015',
    tags: ['Crime', 'Open World', 'Action', 'Multiplayer', 'Driving'],
    reviewScore: 9.1,
    totalReviews: 156000,
    deliveryMethod: 'Steam Key',
    usersOnPage: 2341,
    activationInstructions: 'Download and install Steam. Log into your Steam account. Click "Add a Game" and select "Activate a Product on Steam". Enter your key and follow the instructions.'
  },
  {
    id: '5',
    title: 'Elden Ring',
    originalPrice: 59.99,
    discountedPrice: 47.99,
    discount: 20,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco Entertainment',
    genre: ['RPG', 'Action', 'Souls-like'],
    releaseDate: 'February 25, 2022',
    tags: ['Souls-like', 'Fantasy', 'Difficult', 'Open World', 'Dark Fantasy'],
    reviewScore: 9.5,
    totalReviews: 98000,
    deliveryMethod: 'Steam Key',
    usersOnPage: 1876,
    activationInstructions: 'Download and install Steam. Log into your Steam account. Click "Add a Game" and select "Activate a Product on Steam". Enter your key and follow the instructions.'
  },

  // PlayStation Games
  {
    id: '6',
    title: 'Spider-Man: Miles Morales',
    originalPrice: 49.99,
    discountedPrice: 29.99,
    discount: 40,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man.',
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Adventure', 'Superhero'],
    releaseDate: 'November 12, 2020',
    tags: ['Superhero', 'Open World', 'Action', 'Story Rich', 'Third Person'],
    reviewScore: 8.7,
    totalReviews: 45000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 678,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },
  {
    id: '7',
    title: 'The Last of Us Part II',
    originalPrice: 59.99,
    discountedPrice: 19.99,
    discount: 67,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.',
    developer: 'Naughty Dog',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Adventure', 'Survival'],
    releaseDate: 'June 19, 2020',
    tags: ['Post-Apocalyptic', 'Story Rich', 'Survival', 'Action', 'Drama'],
    reviewScore: 8.4,
    totalReviews: 78000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 432,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },
  {
    id: '8',
    title: 'God of War',
    originalPrice: 49.99,
    discountedPrice: 24.99,
    discount: 50,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Adventure', 'Mythology'],
    releaseDate: 'April 20, 2018',
    tags: ['Mythology', 'Action', 'Story Rich', 'Third Person', 'Norse'],
    reviewScore: 9.2,
    totalReviews: 92000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 756,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },
  {
    id: '9',
    title: 'Horizon Zero Dawn',
    originalPrice: 49.99,
    discountedPrice: 19.99,
    discount: 60,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Experience Aloy\'s legendary quest to unravel the mysteries of a future Earth ruled by Machines.',
    developer: 'Guerrilla Games',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'RPG', 'Open World'],
    releaseDate: 'February 28, 2017',
    tags: ['Post-Apocalyptic', 'Open World', 'RPG', 'Robots', 'Female Protagonist'],
    reviewScore: 8.9,
    totalReviews: 67000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 543,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },
  {
    id: '10',
    title: 'Bloodborne',
    originalPrice: 39.99,
    discountedPrice: 14.99,
    discount: 63,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Hunt your nightmares as you search for answers in the ancient city of Yharnam, now cursed with a strange endemic illness spreading through the streets.',
    developer: 'FromSoftware',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'RPG', 'Souls-like'],
    releaseDate: 'March 24, 2015',
    tags: ['Souls-like', 'Gothic', 'Difficult', 'Horror', 'Dark Fantasy'],
    reviewScore: 9.1,
    totalReviews: 54000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 321,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },

  // Xbox Games
  {
    id: '11',
    title: 'Halo Infinite',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'When all hope is lost and humanity\'s fate hangs in the balance, Master Chief is ready to confront the most ruthless foe he\'s ever faced.',
    developer: '343 Industries',
    publisher: 'Microsoft Studios',
    genre: ['FPS', 'Action', 'Sci-Fi'],
    releaseDate: 'December 8, 2021',
    tags: ['FPS', 'Sci-Fi', 'Multiplayer', 'Campaign', 'Master Chief'],
    reviewScore: 8.3,
    totalReviews: 76000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 987,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },
  {
    id: '12',
    title: 'Forza Horizon 5',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Your greatest Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action.',
    developer: 'Playground Games',
    publisher: 'Microsoft Studios',
    genre: ['Racing', 'Open World', 'Arcade'],
    releaseDate: 'November 9, 2021',
    tags: ['Racing', 'Open World', 'Cars', 'Mexico', 'Arcade'],
    reviewScore: 9.0,
    totalReviews: 89000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 1234,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },
  {
    id: '13',
    title: 'Gears 5',
    originalPrice: 39.99,
    discountedPrice: 19.99,
    discount: 50,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'From one of gaming\'s most acclaimed sagas, Gears is bigger than ever, with five thrilling modes and the deepest campaign yet.',
    developer: 'The Coalition',
    publisher: 'Microsoft Studios',
    genre: ['Action', 'TPS', 'Shooter'],
    releaseDate: 'September 10, 2019',
    tags: ['Third Person Shooter', 'Action', 'Co-op', 'Multiplayer', 'Sci-Fi'],
    reviewScore: 8.1,
    totalReviews: 43000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 567,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },
  {
    id: '14',
    title: 'Sea of Thieves',
    originalPrice: 39.99,
    discountedPrice: 19.99,
    discount: 50,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Sea of Thieves offers the essential pirate experience, from sailing and fighting to exploring and looting – everything you need to live the pirate life.',
    developer: 'Rare',
    publisher: 'Microsoft Studios',
    genre: ['Adventure', 'Multiplayer', 'Pirate'],
    releaseDate: 'March 20, 2018',
    tags: ['Pirates', 'Multiplayer', 'Adventure', 'Co-op', 'Open World'],
    reviewScore: 7.8,
    totalReviews: 65000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 432,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },
  {
    id: '15',
    title: 'Microsoft Flight Simulator',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'From light planes to wide-body jets, fly highly detailed and accurate aircraft in the next generation of Microsoft Flight Simulator.',
    developer: 'Asobo Studio',
    publisher: 'Microsoft Studios',
    genre: ['Simulation', 'Flying'],
    releaseDate: 'August 18, 2020',
    tags: ['Flight Simulation', 'Realistic', 'Aircraft', 'World', 'Simulation'],
    reviewScore: 8.9,
    totalReviews: 34000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 234,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },

  // Nintendo Games
  {
    id: '16',
    title: 'The Legend of Zelda: Breath of the Wild',
    originalPrice: 59.99,
    discountedPrice: 49.99,
    discount: 17,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Action', 'Adventure', 'Open World'],
    releaseDate: 'March 3, 2017',
    tags: ['Open World', 'Adventure', 'Fantasy', 'Exploration', 'Zelda'],
    reviewScore: 9.7,
    totalReviews: 156000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 2134,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },
  {
    id: '17',
    title: 'Super Mario Odyssey',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons so you can power up your airship.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Platformer', 'Adventure', '3D'],
    releaseDate: 'October 27, 2017',
    tags: ['Platformer', 'Mario', 'Adventure', 'Family Friendly', '3D'],
    reviewScore: 9.4,
    totalReviews: 98000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 1567,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },
  {
    id: '18',
    title: 'Animal Crossing: New Horizons',
    originalPrice: 59.99,
    discountedPrice: 44.99,
    discount: 25,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Escape to a deserted island and create your own paradise as you explore, create, and customize in Animal Crossing: New Horizons.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Simulation', 'Life Sim', 'Social'],
    releaseDate: 'March 20, 2020',
    tags: ['Life Simulation', 'Relaxing', 'Customization', 'Social', 'Family Friendly'],
    reviewScore: 8.8,
    totalReviews: 87000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 1234,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },
  {
    id: '19',
    title: 'Metroid Dread',
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Join intergalactic bounty hunter Samus Aran in her first new 2D Metroid story in 19 years.',
    developer: 'MercurySteam',
    publisher: 'Nintendo',
    genre: ['Metroidvania', 'Action', 'Sci-Fi'],
    releaseDate: 'October 8, 2021',
    tags: ['Metroidvania', 'Sci-Fi', 'Action', 'Exploration', 'Samus'],
    reviewScore: 8.9,
    totalReviews: 45000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 678,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },
  {
    id: '20',
    title: 'Mario Kart 8 Deluxe',
    originalPrice: 59.99,
    discountedPrice: 49.99,
    discount: 17,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Hit the road with the definitive version of Mario Kart 8 and play anytime, anywhere!',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Racing', 'Arcade', 'Multiplayer'],
    releaseDate: 'April 28, 2017',
    tags: ['Racing', 'Mario', 'Multiplayer', 'Family Friendly', 'Arcade'],
    reviewScore: 9.2,
    totalReviews: 123000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 1876,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },

  // Additional games to reach 30+ for pagination testing
  {
    id: '21',
    title: 'FIFA 24',
    originalPrice: 69.99,
    discountedPrice: 34.99,
    discount: 50,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'EA SPORTS FC 24 welcomes you to The World\'s Game: the most true-to-football experience ever with HyperMotionV.',
    developer: 'EA Sports',
    publisher: 'Electronic Arts',
    genre: ['Sports', 'Football', 'Simulation'],
    releaseDate: 'September 29, 2023',
    tags: ['Football', 'Sports', 'Multiplayer', 'Simulation', 'FIFA'],
    reviewScore: 7.9,
    totalReviews: 78000,
    deliveryMethod: 'Origin Key',
    usersOnPage: 1456,
    activationInstructions: 'Download and install Origin. Log into your Origin account. Click "Redeem Product Code" and enter your key.'
  },
  {
    id: '22',
    title: 'Call of Duty: Modern Warfare III',
    originalPrice: 69.99,
    discountedPrice: 49.99,
    discount: 29,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'In the direct sequel to the record-breaking Call of Duty: Modern Warfare II, Captain Price and Task Force 141 face off against the ultimate threat.',
    developer: 'Sledgehammer Games',
    publisher: 'Activision',
    genre: ['FPS', 'Action', 'Military'],
    releaseDate: 'November 10, 2023',
    tags: ['FPS', 'Military', 'Multiplayer', 'Campaign', 'Modern Warfare'],
    reviewScore: 8.2,
    totalReviews: 89000,
    deliveryMethod: 'Battle.net Key',
    usersOnPage: 2345,
    activationInstructions: 'Download and install Battle.net. Log into your Battle.net account. Click "Redeem a Code" and enter your key.'
  },
  {
    id: '23',
    title: 'Assassin\'s Creed Mirage',
    originalPrice: 49.99,
    discountedPrice: 29.99,
    discount: 40,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Experience the story of Basim, a cunning street thief with nightmarish visions seeking answers and justice.',
    developer: 'Ubisoft Bordeaux',
    publisher: 'Ubisoft',
    genre: ['Action', 'Adventure', 'Stealth'],
    releaseDate: 'October 5, 2023',
    tags: ['Assassins Creed', 'Stealth', 'Historical', 'Action', 'Middle East'],
    reviewScore: 8.1,
    totalReviews: 56000,
    deliveryMethod: 'Ubisoft Connect Key',
    usersOnPage: 789,
    activationInstructions: 'Download and install Ubisoft Connect. Log into your account. Click "Activate a key" and enter your code.'
  },
  {
    id: '24',
    title: 'Starfield',
    originalPrice: 69.99,
    discountedPrice: 39.99,
    discount: 43,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    genre: ['RPG', 'Space', 'Sci-Fi'],
    releaseDate: 'September 6, 2023',
    tags: ['Space', 'RPG', 'Sci-Fi', 'Exploration', 'Bethesda'],
    reviewScore: 7.8,
    totalReviews: 67000,
    deliveryMethod: 'Steam Key',
    usersOnPage: 1234,
    activationInstructions: 'Download and install Steam. Log into your Steam account. Click "Add a Game" and select "Activate a Product on Steam". Enter your key and follow the instructions.'
  },
  {
    id: '25',
    title: 'Baldur\'s Gate 3',
    originalPrice: 59.99,
    discountedPrice: 53.99,
    discount: 10,
    platform: 'pc',
    imageUrl: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    genre: ['RPG', 'Turn-Based', 'Fantasy'],
    releaseDate: 'August 3, 2023',
    tags: ['RPG', 'Turn-Based Combat', 'Fantasy', 'D&D', 'Story Rich'],
    reviewScore: 9.6,
    totalReviews: 145000,
    deliveryMethod: 'Steam Key',
    usersOnPage: 3456,
    activationInstructions: 'Download and install Steam. Log into your Steam account. Click "Add a Game" and select "Activate a Product on Steam". Enter your key and follow the instructions.'
  },

  // More PlayStation games
  {
    id: '26',
    title: 'Ratchet & Clank: Rift Apart',
    originalPrice: 69.99,
    discountedPrice: 29.99,
    discount: 57,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Go dimension-hopping with Ratchet and Clank as they take on an evil emperor from another reality.',
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Platformer', 'Adventure'],
    releaseDate: 'June 11, 2021',
    tags: ['Platformer', 'Action', 'Sci-Fi', 'Family Friendly', 'Adventure'],
    reviewScore: 8.8,
    totalReviews: 43000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 567,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },
  {
    id: '27',
    title: 'Ghost of Tsushima Director\'s Cut',
    originalPrice: 69.99,
    discountedPrice: 39.99,
    discount: 43,
    platform: 'playstation',
    imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'A storm is coming. Venture beyond what you know in Ghost of Tsushima Director\'s Cut.',
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive Entertainment',
    genre: ['Action', 'Adventure', 'Open World'],
    releaseDate: 'August 20, 2021',
    tags: ['Samurai', 'Open World', 'Action', 'Japan', 'Historical'],
    reviewScore: 9.0,
    totalReviews: 78000,
    deliveryMethod: 'PlayStation Store Code',
    usersOnPage: 987,
    activationInstructions: 'Log into your PlayStation account on your console or the PlayStation Store website. Go to "Redeem Codes" and enter your code.'
  },

  // More Xbox games
  {
    id: '28',
    title: 'Starfield',
    originalPrice: 69.99,
    discountedPrice: 39.99,
    discount: 43,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Starfield is the first new universe in 25 years from Bethesda Game Studios.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    genre: ['RPG', 'Space', 'Sci-Fi'],
    releaseDate: 'September 6, 2023',
    tags: ['Space', 'RPG', 'Sci-Fi', 'Exploration', 'Bethesda'],
    reviewScore: 7.8,
    totalReviews: 67000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 1234,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },
  {
    id: '29',
    title: 'Age of Empires IV',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    platform: 'xbox',
    imageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'One of the most beloved real-time strategy games returns to glory with Age of Empires IV.',
    developer: 'Relic Entertainment',
    publisher: 'Microsoft Studios',
    genre: ['RTS', 'Strategy', 'Historical'],
    releaseDate: 'October 28, 2021',
    tags: ['RTS', 'Strategy', 'Historical', 'Medieval', 'Multiplayer'],
    reviewScore: 8.4,
    totalReviews: 34000,
    deliveryMethod: 'Xbox Live Code',
    usersOnPage: 456,
    activationInstructions: 'Sign in to your Xbox account on your console or Xbox.com. Go to "Redeem Code" and enter your 25-character code.'
  },

  // More Nintendo games
  {
    id: '30',
    title: 'Pokémon Legends: Arceus',
    originalPrice: 59.99,
    discountedPrice: 44.99,
    discount: 25,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Get ready for a new kind of grand, Pokémon adventure in Pokémon Legends: Arceus.',
    developer: 'Game Freak',
    publisher: 'Nintendo',
    genre: ['RPG', 'Adventure', 'Monster Collection'],
    releaseDate: 'January 28, 2022',
    tags: ['Pokemon', 'RPG', 'Adventure', 'Monster Collection', 'Open World'],
    reviewScore: 8.3,
    totalReviews: 89000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 1567,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },
  {
    id: '31',
    title: 'Super Smash Bros. Ultimate',
    originalPrice: 59.99,
    discountedPrice: 49.99,
    discount: 17,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'The biggest crossover in gaming history is here! Fighters from across the Nintendo universe come together.',
    developer: 'Bandai Namco Studios',
    publisher: 'Nintendo',
    genre: ['Fighting', 'Multiplayer', 'Party'],
    releaseDate: 'December 7, 2018',
    tags: ['Fighting', 'Multiplayer', 'Nintendo Characters', 'Party Game', 'Competitive'],
    reviewScore: 9.3,
    totalReviews: 134000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 2345,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  },
  {
    id: '32',
    title: 'Splatoon 3',
    originalPrice: 59.99,
    discountedPrice: 49.99,
    discount: 17,
    platform: 'nintendo',
    imageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    heroImageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    description: 'Enter the Splatlands, a sun-scorched desert inhabited by battle-hardened Inklings and Octolings.',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    genre: ['Shooter', 'Multiplayer', 'Action'],
    releaseDate: 'September 9, 2022',
    tags: ['Third Person Shooter', 'Multiplayer', 'Colorful', 'Team-Based', 'Nintendo'],
    reviewScore: 8.7,
    totalReviews: 67000,
    deliveryMethod: 'Nintendo eShop Code',
    usersOnPage: 1234,
    activationInstructions: 'Access the Nintendo eShop on your Nintendo Switch. Select "Enter Code" and input your 16-character download code.'
  }
];

export const useGameStore = create<GameStore>((set, get) => ({
  games: mockGames,
  filteredGames: mockGames,
  currentPage: 1,
  itemsPerPage: 30,
  searchQuery: '',
  selectedPlatform: null,
  isLoading: false,
  error: null,

  setGames: (games) => {
    set({ games });
    // Initialize the game API with the new games data
    gameApi.initializeMock(games);
    get().filterGames();
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().filterGames();
  },

  setSelectedPlatform: (platform) => {
    set({ selectedPlatform: platform, currentPage: 1 });
    get().filterGames();
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  filterGames: () => {
    const { games, searchQuery, selectedPlatform } = get();
    
    let filtered = games;

    // Filter by platform
    if (selectedPlatform) {
      filtered = filtered.filter(game => game.platform === selectedPlatform);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query) ||
        game.publisher.toLowerCase().includes(query) ||
        game.genre.some(g => g.toLowerCase().includes(query)) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    set({ filteredGames: filtered });
  },

  getGameById: (id) => {
    return get().games.find(game => game.id === id);
  },

  getPaginatedGames: () => {
    const { filteredGames, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGames.slice(startIndex, endIndex);
  },

  getTotalPages: () => {
    const { filteredGames, itemsPerPage } = get();
    return Math.ceil(filteredGames.length / itemsPerPage);
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      selectedPlatform: null,
      currentPage: 1
    });
    get().filterGames();
  },

  // API Actions
  fetchGames: async () => {
    const { setLoading, setError, setGames } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameApi.getAll();
      setGames(response.data);
    } catch (error: any) {
      console.error('Failed to fetch games:', error);
      setError(error.message || 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  },

  fetchGameById: async (id: string) => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const game = await gameApi.getById(id);
      return game;
    } catch (error: any) {
      console.error('Failed to fetch game:', error);
      setError(error.message || 'Failed to fetch game');
      return null;
    } finally {
      setLoading(false);
    }
  },

  searchGames: (query: string, platform?: string) => {
    const { games } = get();
    
    let filtered = games;

    // Filter by platform if provided
    if (platform) {
      filtered = filtered.filter(game => game.platform === platform);
    }

    // Filter by search query
    if (query.trim()) {
      const searchQuery = query.toLowerCase().trim();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery) ||
        game.developer.toLowerCase().includes(searchQuery) ||
        game.publisher.toLowerCase().includes(searchQuery) ||
        game.genre.some(g => g.toLowerCase().includes(searchQuery)) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    return filtered;
  }
}));

// Initialize the mock API with the default games
gameApi.initializeMock(mockGames);