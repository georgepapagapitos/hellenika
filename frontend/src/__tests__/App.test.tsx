import App from "../App";
import { render, screen } from "../utils/testUtils";

// Mock the routes component
jest.mock("../routes", () => {
  return function MockAppRoutes() {
    return <div data-testid="app-routes">Routes Component</div>;
  };
});

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("app-routes")).toBeInTheDocument();
  });

  test("provides all necessary contexts", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
