import axios from "axios";
import { API_ENDPOINTS } from "../config";

// Create a dedicated API client
const createApiClient = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const api = createApiClient();

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_content: number;
  user_growth: number;
  content_growth: number;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joined: string;
  status: string;
}

export interface RecentContent {
  id: number;
  title: string;
  type: string;
  created: string;
  status: string;
}

class AdminService {
  private getHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>(
      `${API_ENDPOINTS.admin}/stats`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async getRecentUsers(): Promise<RecentUser[]> {
    const response = await api.get<RecentUser[]>(
      `${API_ENDPOINTS.admin}/users`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async getRecentContent(): Promise<RecentContent[]> {
    const response = await api.get<RecentContent[]>(
      `${API_ENDPOINTS.admin}/content`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }
}

export const adminService = new AdminService();
