import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `VITE_`.
   */
  client: {
    VITE_APP_NAME: z.string().min(1),
    VITE_API_URI: z.string().url(),
  },
  runtimeEnv: import.meta.env,
});
