import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/signin")({
  component: SignIn,
});

function SignIn() {
  return <div className="p-2">Hello from Sign In!</div>;
}
