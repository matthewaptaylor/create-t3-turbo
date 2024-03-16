import cors from "@fastify/cors";
import fastify from "fastify";

import { initMailer } from "@acme/mailer";
import { i18n, setupI18n } from "@acme/translations";

import { initDb } from "./db";
import {
  getAuthCorsHeaders,
  setupFastifyAuth,
  setupFastifyAuthErrorHandler,
} from "./endpoints/auth";
import { setupFastifyTrpc } from "./endpoints/trpc";
import { env } from "./env";

/**
 * Bootstrap the server.
 */
const bootstrap = async () => {
  const server = fastify({
    maxParamLength: 5000,
  });

  // Register error handlers
  setupFastifyAuthErrorHandler(server);

  // Setup mailer
  await setupI18n();
  initMailer(env.MAILJET_API_KEY, env.MAILJET_API_SECRET, i18n);

  await initDb();

  // Register plugins and middlewares
  await setupFastifyAuth(server);
  await setupFastifyTrpc(server);
  await server.register(cors, {
    origin: env.WEBSITE_URI,
    credentials: true,
    allowedHeaders: ["Content-Type", ...getAuthCorsHeaders()],
  });

  try {
    await server.listen({ port: 3002 });
    console.info("Server listening on port 3002");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

bootstrap().catch(console.error);
