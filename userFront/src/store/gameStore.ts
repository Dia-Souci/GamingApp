import { create } from 'zustand';
import { gameService } from '../services/api';

export interface Game {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  currency: string;
  platform: 'pc' | 'playstation' | 'xbox' | 'nintendo';
  platforms?: string[];
  genre?: string[];
  tags?: string[];
  imageUrl?: string;
  heroImageUrl?: string;
  screenshots?: string[];
  videoUrl?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: Date;
  deliveryMethod?: string;
  systemRequirements?: {
    minimum: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    recommended: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
  };
  reviewScore?: number;
  totalReviews?: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  viewCount?: number;
  purchaseCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
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
  totalPages: number;
  totalGames: number;
  
  // Actions
  setGames: (games: Game[]) => void;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (totalPages: number, totalGames: number) => void;
  filterGames: () => void;
  getGameById: (id: string) => Game | undefined;
  getPaginatedGames: () => Game[];
  getTotalPages: () => number;
  resetFilters: () => void;
  
  // API Actions
  fetchGames: (page?: number, filters?: Record<string, unknown>) => Promise<void>;
  fetchGameById: (id: string) => Promise<Game | null>;
  fetchGameBySlug: (slug: string) => Promise<Game | null>;
  searchGames: (query: string, platform?: string) => Promise<void>;
  fetchFeaturedGames: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  games: [],
  filteredGames: [],
  currentPage: 1,
  itemsPerPage: 20,
  searchQuery: '',
  selectedPlatform: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  totalGames: 0,
  
  setGames: (games) => set({ games, filteredGames: games }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
  
  setPagination: (totalPages, totalGames) => set({ totalPages, totalGames }),

  filterGames: () => {
    const { games, searchQuery, selectedPlatform } = get();
    let filtered = [...games];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.developer?.toLowerCase().includes(query) ||
        game.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedPlatform) {
      filtered = filtered.filter(game => game.platform === selectedPlatform);
    }

    set({ filteredGames: filtered });
  },

  getGameById: (id) => {
    const { games } = get();
    return games.find(game => game._id === id);
  },

  getPaginatedGames: () => {
    const { filteredGames, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGames.slice(startIndex, endIndex);
  },

  getTotalPages: () => {
    const { totalPages } = get();
    return totalPages;
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      selectedPlatform: null,
      currentPage: 1,
      filteredGames: get().games 
    });
  },

  fetchGames: async (page = 1, filters: Record<string, unknown> = {}) => {
    const { setLoading, setError, setGames, setPagination } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: get().itemsPerPage,
        ...filters
      };
      
      const response = await gameService.getAll(params);
      
      // Handle different response structures
      if (response && response.data) {
      setGames(response.data);
        if (response.pagination) {
          setPagination(response.pagination.totalPages, response.pagination.total);
        } else {
          setPagination(1, response.data.length);
        }
        set({ currentPage: page });
      } else {
        // Fallback for direct array response
        const gamesArray = Array.isArray(response) ? response : [];
        setGames(gamesArray);
        setPagination(1, gamesArray.length);
        set({ currentPage: page });
      }
    } catch (error: unknown) {
      console.error('Error fetching games:', error);
      
      // If it's a network error (API not running), show a helpful message
      if (error instanceof Error && (error.message?.includes('Network error') || (error as { status?: number }).status === 0)) {
        setError('Unable to connect to the server. Please make sure the API is running.');
      } else {
      setError(error instanceof Error ? error.message : 'Failed to fetch games');
      }
      
      // Set empty state to prevent undefined errors
      setGames([]);
      setPagination(0, 0);
    } finally {
      setLoading(false);
    }
  },

  fetchGameById: async (id: string) => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const game = await gameService.getById(id);
      
      // Add to games array if not already present
      const { games } = get();
      if (!games.find(g => g._id === game._id)) {
        set({ games: [...games, game] });
      }
      
      return game;
    } catch (error: unknown) {
      console.error('Error fetching game:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch game');
      return null;
    } finally {
      setLoading(false);
    }
  },

  fetchGameBySlug: async (slug: string) => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const game = await gameService.getBySlug(slug);
      
      // Add to games array if not already present
    const { games } = get();
      if (!games.find(g => g._id === game._id)) {
        set({ games: [...games, game] });
      }
      
      return game;
    } catch (error: unknown) {
      console.error('Error fetching game:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch game');
      return null;
    } finally {
      setLoading(false);
    }
  },
  
  searchGames: async (query: string, platform?: string) => {
    const { setLoading, setError, setGames, setPagination } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const filters: Record<string, unknown> = { q: query };
    if (platform) {
        filters.platform = platform;
      }
      
      const response = await gameService.search(query, filters);
      
      // Handle different response structures
      if (response && response.data) {
        setGames(response.data);
        if (response.pagination) {
          setPagination(response.pagination.totalPages, response.pagination.total);
        } else {
          setPagination(1, response.data.length);
        }
        set({ currentPage: 1, searchQuery: query, selectedPlatform: platform || null });
      } else {
        // Fallback for direct array response
        const gamesArray = Array.isArray(response) ? response : [];
        setGames(gamesArray);
        setPagination(1, gamesArray.length);
        set({ currentPage: 1, searchQuery: query, selectedPlatform: platform || null });
      }
    } catch (error: unknown) {
      console.error('Error searching games:', error);
      
      // If it's a network error (API not running), show a helpful message
      if (error instanceof Error && (error.message?.includes('Network error') || (error as { status?: number }).status === 0)) {
        setError('Unable to connect to the server. Please make sure the API is running.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to search games');
      }
      
      // Set empty state to prevent undefined errors
      setGames([]);
      setPagination(0, 0);
    } finally {
      setLoading(false);
    }
  },
  
  fetchFeaturedGames: async () => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const featuredGames = await gameService.getFeatured(12);
      
      // Add featured games to the store
      if (featuredGames && Array.isArray(featuredGames)) {
        const { games } = get();
        const newGames = featuredGames.filter(game => !games.find(g => g._id === game._id));
        if (newGames.length > 0) {
          set({ games: [...games, ...newGames] });
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching featured games:', error);
      
      // Don't show error for featured games as it's not critical
      // Just log it for debugging
    } finally {
      setLoading(false);
    }
  },
}));