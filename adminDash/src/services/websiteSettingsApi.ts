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

export interface CreateWebsiteSettingsDto {
  name?: string;
  heroImageUrl: string;
  displayedCategories: string[];
  featuredGame?: string | null;
  isActive?: boolean;
}

export interface UpdateWebsiteSettingsDto {
  name?: string;
  heroImageUrl?: string;
  displayedCategories?: string[];
  featuredGame?: string | null;
  isActive?: boolean;
}

class WebsiteSettingsApi {
  private baseURL = `${API_BASE_URL}/website-settings`;

  async getSettings(): Promise<WebsiteSettings> {
    const response = await axios.get(this.baseURL);
    return response.data;
  }

  async createSettings(data: CreateWebsiteSettingsDto): Promise<WebsiteSettings> {
    const token = localStorage.getItem('adminToken');
    const response = await axios.post(this.baseURL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async updateSettings(data: UpdateWebsiteSettingsDto): Promise<WebsiteSettings> {
    const token = localStorage.getItem('adminToken');
    const response = await axios.patch(this.baseURL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async setFeaturedGame(gameId: string): Promise<WebsiteSettings> {
    const token = localStorage.getItem('adminToken');
    const response = await axios.post(`${this.baseURL}/featured-game/${gameId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async removeFeaturedGame(): Promise<WebsiteSettings> {
    const token = localStorage.getItem('adminToken');
    const response = await axios.delete(`${this.baseURL}/featured-game`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async deleteSettings(): Promise<void> {
    const token = localStorage.getItem('adminToken');
    await axios.delete(this.baseURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const websiteSettingsApi = new WebsiteSettingsApi();
