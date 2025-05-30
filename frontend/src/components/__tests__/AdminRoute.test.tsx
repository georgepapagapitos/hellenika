import { authService } from "../../services/authService";
import { render, screen, waitFor } from "../../utils/testUtils";
import AdminRoute from "../AdminRoute";

// Mock the authService the same way as ProtectedRoute test
jest.mock("../../services/authService");

const AdminTestChild = () => (
  <div data-testid="admin-content">Admin Content</div>
);

describe("AdminRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render children when user is not authenticated", async () => {
    (authService.getToken as jest.Mock).mockReturnValue(null);

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });

  test("does not render children when user is authenticated but not admin", async () => {
    (authService.getToken as jest.Mock).mockReturnValue("valid-token");
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "user@example.com",
      role: "user", // Regular user, not admin
      is_active: true,
    });

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });

  test("renders children when user is authenticated and is admin", async () => {
    (authService.getToken as jest.Mock).mockReturnValue("valid-token");
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "admin@example.com",
      role: "admin", // Admin user
      is_active: true,
    });

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("admin-content")).toBeInTheDocument();
    });

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  test("shows loading spinner while authentication is loading", async () => {
    (authService.getToken as jest.Mock).mockReturnValue("some-token");
    (authService.getCurrentUser as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });

  test("loading takes precedence over admin status", async () => {
    // Even if admin, should show loading when isLoading is true
    (authService.getToken as jest.Mock).mockReturnValue("admin-token");
    (authService.getCurrentUser as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves, keeps loading
    );

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });

  test("handles authentication error gracefully", async () => {
    // Token exists but getCurrentUser fails
    (authService.getToken as jest.Mock).mockReturnValue("invalid-token");
    (authService.getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Unauthorized"),
    );

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Should not show admin content when auth fails
    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });

  test("handles multiple children when user is admin", async () => {
    (authService.getToken as jest.Mock).mockReturnValue("valid-token");
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "admin@example.com",
      role: "admin",
      is_active: true,
    });

    render(
      <AdminRoute>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <AdminTestChild />
      </AdminRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("admin-content")).toBeInTheDocument();
    });

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  test("loading spinner has full height styling", async () => {
    (authService.getToken as jest.Mock).mockReturnValue("some-token");
    (authService.getCurrentUser as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();

    // Check that it's wrapped in a full-height Box
    const loadingContainer = progressBar.closest(".MuiBox-root");
    expect(loadingContainer).toBeInTheDocument();
  });

  test("redirects non-admin users even if authenticated", async () => {
    // Test different non-admin roles
    const nonAdminRoles = ["user", "moderator", "editor"];

    for (const role of nonAdminRoles) {
      (authService.getToken as jest.Mock).mockReturnValue("valid-token");
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        id: 1,
        email: `${role}@example.com`,
        role: role,
        is_active: true,
      });

      const { unmount } = render(
        <AdminRoute>
          <AdminTestChild />
        </AdminRoute>,
      );

      await waitFor(() => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });

      expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();

      unmount();
    }
  });

  test("handles inactive admin user", async () => {
    (authService.getToken as jest.Mock).mockReturnValue("valid-token");
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "admin@example.com",
      role: "admin",
      is_active: false, // Inactive admin
    });

    render(
      <AdminRoute>
        <AdminTestChild />
      </AdminRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("admin-content")).toBeInTheDocument();
    });

    // Should still allow access since we only check role, not is_active
    // (This tests current behavior - you might want to add is_active check later)
  });
});
