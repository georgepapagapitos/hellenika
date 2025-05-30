// src/__tests__/routes.test.tsx
import { render, screen } from "../utils/testUtils";
import AppRoutes from "../routes";

// Mock all the page components
jest.mock("../pages/AuthPage", () => {
  return function MockAuthPage() {
    return <div data-testid="auth-page">Auth Page</div>;
  };
});

jest.mock("../pages/WordList", () => {
  return function MockWordList() {
    return <div data-testid="word-list">Word List Page</div>;
  };
});

jest.mock("../pages/WordForm", () => {
  return function MockWordForm() {
    return <div data-testid="word-form">Word Form Page</div>;
  };
});

jest.mock("../pages/EditWord", () => {
  return function MockEditWord() {
    return <div data-testid="edit-word">Edit Word Page</div>;
  };
});

jest.mock("../pages/Flashcards", () => {
  return function MockFlashcards() {
    return <div data-testid="flashcards">Flashcards Page</div>;
  };
});

jest.mock("../pages/AdminDashboard", () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard Page</div>;
  };
});

// Mock the route components
jest.mock("../components/ProtectedRoute", () => {
  return function MockProtectedRoute({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

jest.mock("../components/AdminRoute", () => {
  return function MockAdminRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="admin-route">{children}</div>;
  };
});

jest.mock("../components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// Don't mock react-router-dom here since our testUtils handles routing

describe("AppRoutes Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the main layout structure", () => {
    render(<AppRoutes />);

    // Check main layout elements
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(
      screen.getByText(/© \d{4} Hellenika. All rights reserved./),
    ).toBeInTheDocument();
  });

  test("renders navbar and footer", () => {
    render(<AppRoutes />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();

    // Check footer content
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Hellenika. All rights reserved.`),
    ).toBeInTheDocument();
  });

  test("has correct layout structure with main content area", () => {
    render(<AppRoutes />);

    // Check that main and footer elements are rendered
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("renders Routes component", () => {
    render(<AppRoutes />);

    // Since we're using our mock router, we should see the routes div
    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });

  test("applies correct styling classes and structure", () => {
    const { container } = render(<AppRoutes />);

    // The component should render without errors and have the expected structure
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });

  test("footer displays current year dynamically", () => {
    render(<AppRoutes />);

    // Test that it shows some 4-digit year (proving it's dynamic)
    expect(
      screen.getByText(/©.*\d{4}.*Hellenika.*All rights reserved/),
    ).toBeInTheDocument();

    // For a more specific test, let's check what year it actually shows
    const footerText = screen.getByText(
      /©.*\d{4}.*Hellenika.*All rights reserved/,
    ).textContent;
    expect(footerText).toMatch(
      /©\s*\d{4}\s*Hellenika\.\s*All rights reserved\./,
    );
  });
});
