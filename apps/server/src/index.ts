import cors from "@fastify/cors";
import fastify from "fastify";

import {
  setupFastifyAuth,
  setupFastifyAuthErrorHandler,
} from "./endpoints/auth";
import { setupFastifyTrpc } from "./endpoints/trpc";

/**
 * Bootstrap the server.
 */
const bootstrap = async () => {
  const server = fastify({
    maxParamLength: 5000,
  });

  // Register error handlers
  setupFastifyAuthErrorHandler(server);

  // Register plugins and middlewares
  await server.register(cors);
  await setupFastifyAuth(server);
  await setupFastifyTrpc(server);

  try {
    await server.listen({ port: 3002 });
    console.info("Server listening on port 3002");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

bootstrap().catch(console.error);
