import type { FC } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout: FC = () => (
  <div className="mx-auto flex h-screen w-full max-w-sm flex-col justify-center space-y-4 p-4">
    <Outlet />
  </div>
);

export const Route = createFileRoute("/_auth-layout")({
  component: AuthLayout,
});
