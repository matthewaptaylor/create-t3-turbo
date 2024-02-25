import cors from "@fastify/cors";
import fastify from "fastify";

import { initDb } from "@acme/api";

import { setupFastifyTrpc } from "./trpc";

/**
 * Bootstrap the server.
 */
const bootstrap = async () => {
  const server = fastify({
    maxParamLength: 5000,
  });

  // Register plugins and middlewares
  initDb().catch(console.error);
  await setupFastifyTrpc(server);

  await server.register(cors);

  try {
    await server.listen({ port: 3002 });
    console.info("Server listening on port 3002");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

bootstrap().catch(console.error);
