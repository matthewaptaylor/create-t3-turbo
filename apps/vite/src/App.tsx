import type { FC } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { api, useTrpcClient } from "~/lib/api";
import { router } from "~/lib/router";

export const App: FC = () => {
  const [queryClient] = useState(() => new QueryClient());
  const trpcClient = useTrpcClient();

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* <TanStackRouterDevtools /> */}
      </QueryClientProvider>
    </api.Provider>
  );
};
