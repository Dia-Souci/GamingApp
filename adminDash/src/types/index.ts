// Re-export types from API service for backward compatibility
export type { Game, Order, User, DashboardStats } from '../services/api';

export interface CarouselItem {
  id: string;
  title: string;
  image: string;
  link: string;
  active: boolean;
}

// Keep homepage content type for now
export interface HomepageContent {
  heroBanner: string;
  categories: {
    xbox: boolean;
    playstation: boolean;
    pc: boolean;
    merchandise: boolean;
  };
  carousel: CarouselItem[];
}