import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `VITE_`.
   */
  client: {
    EXPO_PUBLIC_TITLE: z.string().min(1),
  },
  runtimeEnv: {
    EXPO_PUBLIC_TITLE: process.env.EXPO_PUBLIC_TITLE,
  },
});
