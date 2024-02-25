import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  clientPrefix: "VITE_",
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {},
  runtimeEnv: import.meta.env,
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
