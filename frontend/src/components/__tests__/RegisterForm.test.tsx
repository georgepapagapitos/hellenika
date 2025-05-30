import { render, screen, waitFor } from "../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../RegisterForm";
import { authService } from "../../services/authService";

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe("RegisterForm Component", () => {
  const mockOnSuccess = jest.fn();
  const mockOnLoginClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders registration form elements", () => {
    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Create Account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Start your Greek learning journey"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  test("handles successful registration", async () => {
    const user = userEvent.setup();
    (authService.register as jest.Mock).mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
      role: "user",
      is_active: true,
    });

    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test("displays error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "differentpassword",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    // Should not call register or onSuccess
    expect(mockAuthService.register).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test("displays error on failed registration", async () => {
    const user = userEvent.setup();
    (authService.register as jest.Mock).mockRejectedValueOnce(
      new Error("Registration failed"),
    );

    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Registration failed. Please try again."),
      ).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test("calls onLoginClick when sign in button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    await user.click(screen.getByText("Sign in"));
    expect(mockOnLoginClick).toHaveBeenCalled();
  });

  test("shows loading state during registration", async () => {
    const user = userEvent.setup();
    // Mock register to return a pending promise
    (authService.register as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Button should show loading state
    expect(
      screen.getByRole("button", { name: /creating account.../i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /creating account.../i }),
    ).toBeDisabled();
  });

  test("clears error when form is resubmitted", async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    // First submission with mismatched passwords
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "different");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    // Fix the confirm password and resubmit
    await user.clear(screen.getByLabelText(/confirm password/i));
    await user.type(screen.getByLabelText(/confirm password/i), "password123");

    (authService.register as jest.Mock).mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
      role: "user",
      is_active: true,
    });

    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Error should be cleared
    await waitFor(() => {
      expect(
        screen.queryByText("Passwords do not match"),
      ).not.toBeInTheDocument();
    });
  });

  test("form fields have correct attributes", () => {
    render(
      <RegisterForm
        onSuccess={mockOnSuccess}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const emailField = screen.getByLabelText(/email/i);
    const passwordField = screen.getByLabelText(/^password/i);
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);

    expect(emailField).toHaveAttribute("type", "email");
    expect(emailField).toHaveAttribute("required");
    expect(emailField).toHaveAttribute("autocomplete", "email");

    expect(passwordField).toHaveAttribute("type", "password");
    expect(passwordField).toHaveAttribute("required");
    expect(passwordField).toHaveAttribute("autocomplete", "new-password");

    expect(confirmPasswordField).toHaveAttribute("type", "password");
    expect(confirmPasswordField).toHaveAttribute("required");
    expect(confirmPasswordField).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
  });
});
