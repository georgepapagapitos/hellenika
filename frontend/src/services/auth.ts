import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create a dedicated API client
const createApiClient = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const api = createApiClient();

export interface User {
  id: number;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>(`${API_URL}/auth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    this.setToken(response.data.access_token);
    return response.data;
  }

  async register(credentials: LoginCredentials): Promise<User> {
    // First register the user
    await api.post<User>(`${API_URL}/auth/register`, credentials);
    // Then automatically log in to get the token
    const authResponse = await this.login(credentials);
    // Finally get the user data
    return this.getCurrentUser();
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No token found');
    }
    const response = await api.get<User>(`${API_URL}/auth/users/me`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  }
}

export const authService = new AuthService(); 