export type {
  User,
  LoginCredentials,
  AuthResponse,
} from "../services/authService";

const mockUser = {
  id: 1,
  email: "test@example.com",
  role: "user",
  is_active: true,
};

const mockAuthResponse = {
  access_token: "mock-token",
  token_type: "bearer",
};

export const authService = {
  login: jest.fn().mockResolvedValue(mockAuthResponse),
  register: jest.fn().mockResolvedValue(mockUser),
  logout: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  getToken: jest.fn().mockReturnValue("mock-token"),
  getCurrentUser: jest.fn().mockResolvedValue(mockUser),
};
