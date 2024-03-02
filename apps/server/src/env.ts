import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    SUPERTOKENS_CONNECTION_URI: z.string().url(),
    SUPERTOKENS_API_KEY: z.string().min(1),
    SUPERTOKENS_APP_NAME: z.string().min(1),
    API_URI: z.string().url(),
    WEBSITE_URI: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
