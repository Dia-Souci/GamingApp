// Game API Service - Integrates with existing game store
import { Game } from '../store/gameStore';
import { gameService, GameFilters, PaginatedResponse } from './api';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Use mock API flag from environment
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Mock implementation using existing game store data
class MockGameApi {
  private games: Game[] = [];

  // Initialize with games from store
  setGames(games: Game[]) {
    this.games = games;
  }

  async getAll(filters?: GameFilters): Promise<PaginatedResponse<Game>> {
    await mockDelay();
    
    let filteredGames = [...this.games];
    
    // Apply platform filter
    if (filters?.platform) {
      filteredGames = filteredGames.filter(game => game.platform === filters.platform);
    }
    
    // Apply search filter
    if (filters?.q) {
      const query = filters.q.toLowerCase();
      filteredGames = filteredGames.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query) ||
        game.publisher.toLowerCase().includes(query) ||
        game.genre.some(g => g.toLowerCase().includes(query)) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (filters?.sortBy) {
      filteredGames.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'price':
            aValue = a.discountedPrice;
            bValue = b.discountedPrice;
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'releaseDate':
            aValue = new Date(a.releaseDate);
            bValue = new Date(b.releaseDate);
            break;
          case 'reviewScore':
            aValue = a.reviewScore;
            bValue = b.reviewScore;
            break;
          default:
            return 0;
        }
        
        if (filters.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedGames = filteredGames.slice(startIndex, endIndex);
    
    return {
      data: paginatedGames,
      pagination: {
        page,
        limit,
        total: filteredGames.length,
        totalPages: Math.ceil(filteredGames.length / limit),
      },
    };
  }

  async getById(id: string): Promise<Game> {
    await mockDelay(300);
    
    const game = this.games.find(g => g.id === id);
    if (!game) {
      throw new Error('Game not found');
    }
    
    return game;
  }

  async getByPlatform(platform: string, filters?: Omit<GameFilters, 'platform'>): Promise<PaginatedResponse<Game>> {
    return this.getAll({ ...filters, platform });
  }

  async search(query: string, filters?: Omit<GameFilters, 'q'>): Promise<PaginatedResponse<Game>> {
    return this.getAll({ ...filters, q: query });
  }

  async getFeatured(limit: number = 12): Promise<Game[]> {
    await mockDelay(400);
    
    // Return games with highest review scores
    const sortedGames = [...this.games].sort((a, b) => b.reviewScore - a.reviewScore);
    return sortedGames.slice(0, limit);
  }
}

// Create mock instance
const mockGameApi = new MockGameApi();

// Game API wrapper that chooses between real API and mock
export const gameApi = {
  // Initialize mock API with games data
  initializeMock: (games: Game[]) => {
    mockGameApi.setGames(games);
  },

  // Get all games with filtering
  getAll: async (filters?: GameFilters): Promise<PaginatedResponse<Game>> => {
    if (USE_MOCK_API) {
      return mockGameApi.getAll(filters);
    }
    return gameService.getAll(filters);
  },

  // Get game by ID
  getById: async (id: string): Promise<Game> => {
    if (USE_MOCK_API) {
      return mockGameApi.getById(id);
    }
    return gameService.getById(id);
  },

  // Get games by platform
  getByPlatform: async (platform: string, filters?: Omit<GameFilters, 'platform'>): Promise<PaginatedResponse<Game>> => {
    if (USE_MOCK_API) {
      return mockGameApi.getByPlatform(platform, filters);
    }
    return gameService.getByPlatform(platform, filters);
  },

  // Search games
  search: async (query: string, filters?: Omit<GameFilters, 'q'>): Promise<PaginatedResponse<Game>> => {
    if (USE_MOCK_API) {
      return mockGameApi.search(query, filters);
    }
    return gameService.search(query, filters);
  },

  // Get featured games
  getFeatured: async (limit?: number): Promise<Game[]> => {
    if (USE_MOCK_API) {
      return mockGameApi.getFeatured(limit);
    }
    return gameService.getFeatured(limit);
  },
};

export default gameApi;