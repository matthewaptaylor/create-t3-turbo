import { useState } from "react";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@acme/api";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@acme/api";

/**
 * A custom hook for creating a TRPC client.
 * @returns A TRPC client.
 */
export const useTrpcClient = () => {
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: "http://localhost:3000/trpc",
          async headers() {
            return {
              "x-trpc-source": "vite-react",
            };
          },
        }),
      ],
    }),
  );

  return trpcClient;
};
