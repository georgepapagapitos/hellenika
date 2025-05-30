import userEvent from "@testing-library/user-event";
import { authService } from "../../services/authService";
import { render, screen, waitFor } from "../../utils/testUtils";
import LoginForm from "../LoginForm";

// Mock the auth service
jest.mock("../../services/authService");
const mockAuthService = authService as jest.Mocked<typeof authService>;

describe("LoginForm Component", () => {
  const mockOnSuccess = jest.fn();
  const mockOnRegisterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form elements", () => {
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onRegisterClick={mockOnRegisterClick}
      />,
    );

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    const user = userEvent.setup();
    mockAuthService.login.mockResolvedValueOnce({
      access_token: "token",
      token_type: "bearer",
    });

    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onRegisterClick={mockOnRegisterClick}
      />,
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test("displays error on failed login", async () => {
    const user = userEvent.setup();
    mockAuthService.login.mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onRegisterClick={mockOnRegisterClick}
      />,
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  test("calls onRegisterClick when register button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onRegisterClick={mockOnRegisterClick}
      />,
    );

    await user.click(screen.getByText("Sign up"));
    expect(mockOnRegisterClick).toHaveBeenCalled();
  });
});
