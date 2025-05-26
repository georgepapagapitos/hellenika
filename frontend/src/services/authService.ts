import { API_ENDPOINTS } from "../config";
import { api } from "./apiClient";

export interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
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
    this.token = localStorage.getItem("token");
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append("username", credentials.email);
    params.append("password", credentials.password);

    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.auth.token,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    this.setToken(response.data.access_token);
    return response.data;
  }

  async register(credentials: LoginCredentials): Promise<User> {
    // First register the user
    await api.post<User>(API_ENDPOINTS.auth.register, credentials);
    // Then automatically log in to get the token
    await this.login(credentials);
    // Finally get the user data
    return this.getCurrentUser();
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error("No token found");
    }
    const response = await api.get<User>(API_ENDPOINTS.auth.me);
    return response.data;
  }
}

export const authService = new AuthService();
