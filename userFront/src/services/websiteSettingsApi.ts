import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface WebsiteSettings {
  _id?: string;
  name: string;
  heroImageUrl: string;
  displayedCategories: string[];
  featuredGame?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class WebsiteSettingsApi {
  private baseURL = `${API_BASE_URL}/website-settings`;

  async getSettings(): Promise<WebsiteSettings> {
    const response = await axios.get(this.baseURL);
    return response.data;
  }
}

export const websiteSettingsApi = new WebsiteSettingsApi();
