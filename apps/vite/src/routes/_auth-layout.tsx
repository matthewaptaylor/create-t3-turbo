import type { FC } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout: FC = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
    <Outlet />
  </div>
);

export const Route = createFileRoute("/_auth-layout")({
  component: AuthLayout,
});
