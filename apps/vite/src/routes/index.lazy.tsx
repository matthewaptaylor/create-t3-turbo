import { createLazyFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> Turbo
        </h1>
      </div>
      <Button>Click</Button>
    </main>
  );
}
