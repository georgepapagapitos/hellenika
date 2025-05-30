import { render, screen, waitFor } from "../../utils/testUtils";
import ProtectedRoute from "../ProtectedRoute";
import { authService } from "../../services/authService";

const TestChild = () => (
  <div data-testid="protected-content">Protected Content</div>
);

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render children when user is not authenticated", async () => {
    // Mock no token scenario
    (authService.getToken as jest.Mock).mockReturnValue(null);

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  test("renders children when user is authenticated", async () => {
    // Mock authenticated scenario
    (authService.getToken as jest.Mock).mockReturnValue("valid-token");
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      role: "user",
      is_active: true,
    });

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  test("shows loading spinner while authentication is loading", async () => {
    // Mock token exists but getCurrentUser is pending
    (authService.getToken as jest.Mock).mockReturnValue("some-token");
    (authService.getCurrentUser as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
});
