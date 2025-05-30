import { act, renderHook, waitFor } from "@testing-library/react";
import { authService } from "../../services/authService";
import { AuthProvider, useAuth } from "../AuthContext";

jest.mock("../../services/authService");
const mockAuthService = authService as jest.Mocked<typeof authService>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("provides initial auth state", async () => {
    mockAuthService.getToken.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test("handles successful login", async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.login.mockResolvedValue({
      access_token: "token",
      token_type: "bearer",
    });
    mockAuthService.getCurrentUser.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      role: "user",
      is_active: true,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  test("handles logout", async () => {
    mockAuthService.getToken.mockReturnValue("token");
    mockAuthService.getCurrentUser.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      role: "user",
      is_active: true,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
