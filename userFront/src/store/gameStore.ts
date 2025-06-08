import { create } from 'zustand';

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

interface GameStore {
  games: Game[];
  getGameById: (id: string) => Game | undefined;
}

const gameData: Game[] = [
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamour, and ceaseless body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
    tags: ["STEAM DECK VERIFIED", "RPG", "OPEN WORLD", "CYBERPUNK", "ACTION"],
    reviewScore: 8.5,
    totalReviews: 45672,
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    genre: ["Action", "RPG", "Open World"],
    releaseDate: "December 10, 2020",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 127
  },
  {
    id: "witcher-3-wild-hunt",
    title: "The Witcher 3: Wild Hunt",
    originalPrice: 39.99,
    discountedPrice: 9.99,
    discount: 75,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/1293269/pexels-photo-1293269.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/1293269/pexels-photo-1293269.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
    tags: ["STEAM DECK VERIFIED", "RPG", "FANTASY", "OPEN WORLD", "STORY RICH"],
    reviewScore: 9.3,
    totalReviews: 89234,
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    genre: ["Action", "RPG", "Fantasy"],
    releaseDate: "May 19, 2015",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 89
  },
  {
    id: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    originalPrice: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive.",
    tags: ["WESTERN", "OPEN WORLD", "ACTION", "STORY RICH", "ADVENTURE"],
    reviewScore: 9.1,
    totalReviews: 67891,
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    genre: ["Action", "Adventure", "Western"],
    releaseDate: "December 5, 2019",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 156
  },
  {
    id: "call-of-duty-modern-warfare",
    title: "Call of Duty: Modern Warfare",
    originalPrice: 69.99,
    discountedPrice: 34.99,
    discount: 50,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Prepare to go dark, Modern Warfare is back! The stakes have never been higher as players take on the role of lethal Tier One operators in a heart-racing saga that will affect the global balance of power.",
    tags: ["FPS", "MULTIPLAYER", "ACTION", "MILITARY", "COMPETITIVE"],
    reviewScore: 8.2,
    totalReviews: 34567,
    developer: "Infinity Ward",
    publisher: "Activision",
    genre: ["Action", "FPS", "Multiplayer"],
    releaseDate: "October 25, 2019",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 203
  },
  {
    id: "assassins-creed-valhalla",
    title: "Assassin's Creed Valhalla",
    originalPrice: 59.99,
    discountedPrice: 19.99,
    discount: 67,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Become Eivor, a legendary Viking raider on a quest for glory. Explore England's Dark Ages as you raid your enemies, grow your settlement, and build your political power.",
    tags: ["VIKING", "OPEN WORLD", "ACTION", "HISTORICAL", "ADVENTURE"],
    reviewScore: 8.7,
    totalReviews: 52341,
    developer: "Ubisoft Montreal",
    publisher: "Ubisoft",
    genre: ["Action", "Adventure", "Historical"],
    releaseDate: "November 10, 2020",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 78
  },
  {
    id: "fifa-24",
    title: "FIFA 24",
    originalPrice: 69.99,
    discountedPrice: 39.99,
    discount: 43,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/1040473/pexels-photo-1040473.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/1040473/pexels-photo-1040473.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "EA SPORTS FC 24 welcomes you to The World's Game: the most true-to-football experience ever with HyperMotionV, PlayStyles optimised by Opta, and an enhanced Frostbite Engine.",
    tags: ["SPORTS", "FOOTBALL", "MULTIPLAYER", "SIMULATION", "COMPETITIVE"],
    reviewScore: 7.8,
    totalReviews: 28934,
    developer: "EA Sports",
    publisher: "Electronic Arts",
    genre: ["Sports", "Simulation", "Multiplayer"],
    releaseDate: "September 29, 2023",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 145
  },
  {
    id: "minecraft",
    title: "Minecraft",
    originalPrice: 26.95,
    discountedPrice: 26.95,
    discount: 0,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Minecraft is a game made up of blocks, creatures, and community. You can survive the night or build a work of art – the choice is all yours. But if the thought of exploring a vast new world all on your own feels overwhelming, then it's a good thing that Minecraft can be played with friends.",
    tags: ["SANDBOX", "SURVIVAL", "CREATIVE", "MULTIPLAYER", "FAMILY FRIENDLY"],
    reviewScore: 9.0,
    totalReviews: 156789,
    developer: "Mojang Studios",
    publisher: "Microsoft Studios",
    genre: ["Sandbox", "Survival", "Creative"],
    releaseDate: "November 18, 2011",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 234
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    originalPrice: 59.99,
    discountedPrice: 47.99,
    discount: 20,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    tags: ["SOULS-LIKE", "FANTASY", "OPEN WORLD", "CHALLENGING", "ACTION RPG"],
    reviewScore: 9.5,
    totalReviews: 98765,
    developer: "FromSoftware Inc.",
    publisher: "Bandai Namco Entertainment",
    genre: ["Action", "RPG", "Fantasy"],
    releaseDate: "February 25, 2022",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 312
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    originalPrice: 59.99,
    discountedPrice: 53.99,
    discount: 10,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/1166991/pexels-photo-1166991.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/1166991/pexels-photo-1166991.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Baldur's Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power.",
    tags: ["D&D", "TURN-BASED", "STORY RICH", "FANTASY", "MULTIPLAYER"],
    reviewScore: 9.6,
    totalReviews: 87432,
    developer: "Larian Studios",
    publisher: "Larian Studios",
    genre: ["RPG", "Turn-Based", "Fantasy"],
    releaseDate: "August 3, 2023",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 189
  },
  {
    id: "starfield",
    title: "Starfield",
    originalPrice: 69.99,
    discountedPrice: 41.99,
    discount: 40,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4. In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom.",
    tags: ["SPACE", "RPG", "EXPLORATION", "SCI-FI", "BETHESDA"],
    reviewScore: 8.1,
    totalReviews: 43210,
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    genre: ["RPG", "Space", "Exploration"],
    releaseDate: "September 6, 2023",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 167
  },
  {
    id: "spider-man-remastered",
    title: "Spider-Man Remastered",
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/159868/mario-yoschi-figures-toys-159868.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/159868/mario-yoschi-figures-toys-159868.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "In Marvel's Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story. Play as an experienced Peter Parker, fighting big crime and iconic villains in Marvel's New York.",
    tags: ["SUPERHERO", "ACTION", "OPEN WORLD", "MARVEL", "ADVENTURE"],
    reviewScore: 9.2,
    totalReviews: 76543,
    developer: "Insomniac Games",
    publisher: "PlayStation PC LLC",
    genre: ["Action", "Adventure", "Superhero"],
    releaseDate: "August 12, 2022",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 198
  },
  {
    id: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    originalPrice: 59.99,
    discountedPrice: 35.99,
    discount: 40,
    platform: "Steam",
    imageUrl: "https://images.pexels.com/photos/1298261/pexels-photo-1298261.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    heroImageUrl: "https://images.pexels.com/photos/1298261/pexels-photo-1298261.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books. Experience life as a student at Hogwarts School of Witchcraft and Wizardry in the 1800s.",
    tags: ["HARRY POTTER", "MAGIC", "OPEN WORLD", "RPG", "ADVENTURE"],
    reviewScore: 8.9,
    totalReviews: 65432,
    developer: "Avalanche Software",
    publisher: "Warner Bros. Games",
    genre: ["Action", "RPG", "Adventure"],
    releaseDate: "February 10, 2023",
    activationInstructions: "A Steam account is required for game activation and installation.",
    inStock: true,
    deliveryMethod: "Digital Download",
    usersOnPage: 143
  }
];

export const useGameStore = create<GameStore>((set, get) => ({
  games: gameData,
  getGameById: (id: string) => {
    const { games } = get();
    return games.find(game => game.id === id);
  }
}));