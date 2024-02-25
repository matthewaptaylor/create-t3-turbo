import type { FC } from "react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import { api, useTrpcClient } from "~/lib/api";
import { Button } from "./components/ui/button";

export const App: FC = () => {
  const queryClient = useQueryClient();
  const trpcClient = useTrpcClient();

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <main className="container h-screen py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Create <span className="text-primary">T3</span> Turbo
            </h1>
          </div>
          <Button>Click</Button>
        </main>
      </QueryClientProvider>
    </api.Provider>
  );
};
