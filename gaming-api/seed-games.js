const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gaming-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Game Schema (simplified for seeding)
const gameSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  longDescription: String,
  originalPrice: Number,
  discountedPrice: Number,
  discount: Number,
  currency: String,
  platform: String,
  platforms: [String],
  genre: [String],
  tags: [String],
  imageUrl: String,
  heroImageUrl: String,
  screenshots: [String],
  videoUrl: String,
  developer: String,
  publisher: String,
  releaseDate: Date,
  deliveryMethod: String,
  systemRequirements: Object,
  reviewScore: Number,
  totalReviews: Number,
  stock: Number,
  status: String,
  featured: Boolean,
  viewCount: Number,
  purchaseCount: Number,
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  activationKeys: [{
    key: String,
    isUsed: Boolean,
    addedAt: Date,
    usedAt: Date
  }]
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

// Sample games data
const sampleGames = [
  {
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    description: "An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    longDescription: "Cyberpunk 2077 is an open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
    originalPrice: 4500,
    discountedPrice: 3600,
    discount: 20,
    currency: "DZD",
    platform: "pc",
    platforms: ["pc"],
    genre: ["RPG", "Action", "Adventure"],
    tags: ["Open World", "Cyberpunk", "Story Rich", "RPG"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: new Date("2020-12-10"),
    deliveryMethod: "Digital",
    stock: 50,
    status: "active",
    featured: true,
    reviewScore: 4.2,
    totalReviews: 1250,
    activationKeys: [
      { key: "CYBER-2077-XXXX-YYYY", isUsed: false },
      { key: "CYBER-2077-AAAA-BBBB", isUsed: false },
      { key: "CYBER-2077-CCCC-DDDD", isUsed: false }
    ]
  },
  {
    title: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    description: "A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
    longDescription: "The Witcher 3: Wild Hunt is a story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. In The Witcher, you play as professional monster hunter Geralt of Rivia tasked with finding a child of prophecy in a vast open world rich with merchant cities, pirate islands, dangerous mountain passes, and forgotten caverns to explore.",
    originalPrice: 3500,
    discountedPrice: 2800,
    discount: 20,
    currency: "DZD",
    platform: "pc",
    platforms: ["pc"],
    genre: ["RPG", "Action", "Adventure"],
    tags: ["Open World", "Fantasy", "Story Rich", "RPG"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: new Date("2015-05-19"),
    deliveryMethod: "Digital",
    stock: 75,
    status: "active",
    featured: true,
    reviewScore: 4.8,
    totalReviews: 2100,
    activationKeys: [
      { key: "WITCH-3-XXXX-YYYY", isUsed: false },
      { key: "WITCH-3-AAAA-BBBB", isUsed: false },
      { key: "WITCH-3-CCCC-DDDD", isUsed: false },
      { key: "WITCH-3-EEEE-FFFF", isUsed: false }
    ]
  },
  {
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    description: "An epic tale of life in America's unforgiving heartland. The game's vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience.",
    longDescription: "Red Dead Redemption 2 is an epic tale of life in America's unforgiving heartland. The game's vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience. Red Dead Redemption 2 is an epic tale of life in America's unforgiving heartland. The game's vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience.",
    originalPrice: 5000,
    discountedPrice: 4000,
    discount: 20,
    currency: "DZD",
    platform: "pc",
    platforms: ["pc"],
    genre: ["Action", "Adventure", "Western"],
    tags: ["Open World", "Western", "Story Rich", "Action"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseDate: new Date("2019-12-05"),
    deliveryMethod: "Digital",
    stock: 30,
    status: "active",
    featured: false,
    reviewScore: 4.6,
    totalReviews: 890,
    activationKeys: [
      { key: "RDR2-XXXX-YYYY", isUsed: false },
      { key: "RDR2-AAAA-BBBB", isUsed: false }
    ]
  },
  {
    title: "God of War",
    slug: "god-of-war",
    description: "From Santa Monica Studio and creative director Cory Barlog comes a new beginning for one of gaming's most recognizable icons.",
    longDescription: "From Santa Monica Studio and creative director Cory Barlog comes a new beginning for one of gaming's most recognizable icons. Living as a man outside the shadow of the gods, Kratos must adapt to unfamiliar lands, unexpected threats, and a second chance at being a father. Together with his son Atreus, the pair will venture into the brutal Norse wilds and fight to fulfill a deeply personal quest.",
    originalPrice: 4200,
    discountedPrice: 3360,
    discount: 20,
    currency: "DZD",
    platform: "playstation",
    platforms: ["playstation"],
    genre: ["Action", "Adventure", "Hack and Slash"],
    tags: ["Action", "Adventure", "Story Rich", "Hack and Slash"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    releaseDate: new Date("2018-04-20"),
    deliveryMethod: "Digital",
    stock: 25,
    status: "active",
    featured: true,
    reviewScore: 4.9,
    totalReviews: 1560,
    activationKeys: [
      { key: "GOW-XXXX-YYYY", isUsed: false },
      { key: "GOW-AAAA-BBBB", isUsed: false },
      { key: "GOW-CCCC-DDDD", isUsed: false }
    ]
  },
  {
    title: "The Last of Us Part II",
    slug: "the-last-of-us-part-ii",
    description: "Set five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.",
    longDescription: "Set five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. Living amongst a thriving community of survivors has allowed them peace and stability, despite the constant threat of the infected and other, more desperate survivors.",
    originalPrice: 4800,
    discountedPrice: 3840,
    discount: 20,
    currency: "DZD",
    platform: "playstation",
    platforms: ["playstation"],
    genre: ["Action", "Adventure", "Survival Horror"],
    tags: ["Story Rich", "Survival Horror", "Action", "Adventure"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    releaseDate: new Date("2020-06-19"),
    deliveryMethod: "Digital",
    stock: 20,
    status: "active",
    featured: false,
    reviewScore: 4.7,
    totalReviews: 980,
    activationKeys: [
      { key: "TLOU2-XXXX-YYYY", isUsed: false },
      { key: "TLOU2-AAAA-BBBB", isUsed: false }
    ]
  },
  {
    title: "Halo Infinite",
    slug: "halo-infinite",
    description: "The legendary Halo series returns with the most expansive Master Chief campaign yet and a groundbreaking free-to-play multiplayer experience.",
    longDescription: "The legendary Halo series returns with the most expansive Master Chief campaign yet and a groundbreaking free-to-play multiplayer experience. Halo Infinite provides an amazing experience across the Xbox One and newer family of consoles as well as PC with stunning 4K graphics and world-class cross-platform play.",
    originalPrice: 3800,
    discountedPrice: 3040,
    discount: 20,
    currency: "DZD",
    platform: "xbox",
    platforms: ["xbox"],
    genre: ["Action", "FPS", "Sci-Fi"],
    tags: ["FPS", "Sci-Fi", "Action", "Multiplayer"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "343 Industries",
    publisher: "Xbox Game Studios",
    releaseDate: new Date("2021-12-08"),
    deliveryMethod: "Digital",
    stock: 40,
    status: "active",
    featured: true,
    reviewScore: 4.3,
    totalReviews: 720,
    activationKeys: [
      { key: "HALO-XXXX-YYYY", isUsed: false },
      { key: "HALO-AAAA-BBBB", isUsed: false },
      { key: "HALO-CCCC-DDDD", isUsed: false },
      { key: "HALO-EEEE-FFFF", isUsed: false }
    ]
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    slug: "the-legend-of-zelda-breath-of-the-wild",
    description: "Step into a world of discovery, exploration and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series.",
    longDescription: "Step into a world of discovery, exploration and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series. Travel across vast fields, through forests, and to mountain peaks as you discover what has become of the kingdom of Hyrule in this stunning open-air adventure.",
    originalPrice: 4200,
    discountedPrice: 3360,
    discount: 20,
    currency: "DZD",
    platform: "nintendo",
    platforms: ["nintendo"],
    genre: ["Action", "Adventure", "RPG"],
    tags: ["Open World", "Adventure", "Action", "RPG"],
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
    ],
    developer: "Nintendo",
    publisher: "Nintendo",
    releaseDate: new Date("2017-03-03"),
    deliveryMethod: "Digital",
    stock: 35,
    status: "active",
    featured: true,
    reviewScore: 4.9,
    totalReviews: 1850,
    activationKeys: [
      { key: "ZELDA-XXXX-YYYY", isUsed: false },
      { key: "ZELDA-AAAA-BBBB", isUsed: false },
      { key: "ZELDA-CCCC-DDDD", isUsed: false },
      { key: "ZELDA-EEEE-FFFF", isUsed: false },
      { key: "ZELDA-GGGG-HHHH", isUsed: false }
    ]
  }
];

// Function to seed the database
async function seedGames() {
  try {
    console.log('🌱 Starting to seed games...');
    
    // Clear existing games
    await Game.deleteMany({});
    console.log('🗑️  Cleared existing games');
    
    // Insert new games
    const insertedGames = await Game.insertMany(sampleGames);
    console.log(`✅ Successfully seeded ${insertedGames.length} games:`);
    
    insertedGames.forEach(game => {
      console.log(`   - ${game.title} (${game.platform}) - ${game.originalPrice} ${game.currency}`);
    });
    
    console.log('\n🎮 Games are ready for testing!');
    console.log('You can now:');
    console.log('1. Start your API server: npm run start:dev');
    console.log('2. Visit your admin dashboard to manage games');
    console.log('3. Test the user frontend to browse and purchase games');
    
  } catch (error) {
    console.error('❌ Error seeding games:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedGames();
