import * as React from "react";

export const BrowserRouter = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "browser-router" }, children);

export const Route = ({
  children,
  element,
}: {
  children?: React.ReactNode;
  element?: React.ReactElement;
}) =>
  React.createElement("div", { "data-testid": "route" }, children || element);

export const Routes = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "routes" }, children);

export const Navigate = ({
  to,
  state,
  replace,
}: {
  to: string;
  state?: any;
  replace?: boolean;
}) =>
  React.createElement(
    "div",
    {
      "data-testid": "navigate",
      "data-to": to,
      "data-replace": replace,
    },
    `Redirecting to ${to}`,
  );

export const useNavigate = () => jest.fn();

export const useLocation = () => ({
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "default",
});

export const useParams = () => ({});

export const Link = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) => React.createElement("a", { href: to }, children);

export const NavLink = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) => React.createElement("a", { href: to }, children);
