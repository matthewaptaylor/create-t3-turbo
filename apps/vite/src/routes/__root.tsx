import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

import NotFound from "~/components/NotFound";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/auth/sign-in" className="[&.active]:font-bold">
          Sign In
        </Link>
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
  notFoundComponent: NotFound,
});
