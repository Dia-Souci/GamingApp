import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  // Create a new game
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  // Get all games with optional filtering
  async findAll(query: any = {}): Promise<Game[]> {
    const {
      platform,
      genre,
      search,
      featured,
      status = 'active',
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = query;

    // Build filter object
    const filter: any = { status };

    if (platform) {
      filter.platform = platform;
    }

    if (genre) {
      filter.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    return this.gameModel
      .find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .exec();
  }

  // Get a single game by ID
  async findOne(id: string): Promise<Game> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    
    // Increment view count
    await this.gameModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    
    return game;
  }

  // Get a game by slug
  async findBySlug(slug: string): Promise<Game> {
    const game = await this.gameModel.findOne({ slug, status: 'active' }).exec();
    if (!game) {
      throw new NotFoundException(`Game with slug ${slug} not found`);
    }
    
    // Increment view count
    await this.gameModel.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });
    
    return game;
  }

  // Update a game
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const updatedGame = await this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .exec();
      
    if (!updatedGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    
    return updatedGame;
  }

  // Delete a game (soft delete by changing status)
  async remove(id: string): Promise<Game> {
    const deletedGame = await this.gameModel
      .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      .exec();
      
    if (!deletedGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    
    return deletedGame;
  }

  // Get featured games
  async getFeatured(limit: number = 10): Promise<Game[]> {
    return this.gameModel
      .find({ featured: true, status: 'active' })
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  // Search games by text
  async search(searchTerm: string, limit: number = 20): Promise<Game[]> {
    return this.gameModel
      .find({
        $text: { $search: searchTerm },
        status: 'active'
      })
      .limit(limit)
      .exec();
  }
  // Add this method to your existing GamesService
async updateStock(gameId: string, newStock: number): Promise<void> {
  const game = await this.gameModel.findById(gameId);
  
  if (!game) {
    throw new NotFoundException('Game not found');
  }

  game.stock = newStock;
  
  // Update status based on stock
  if (newStock <= 0) {
    game.status = 'out_of_stock';
  } else if (game.status === 'out_of_stock' && newStock > 0) {
    game.status = 'active';
  }

  await game.save();
}
}