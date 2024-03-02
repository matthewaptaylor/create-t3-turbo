# @acme/server

This server is responsible for all API endpoints. It has two main responsibilities.

1. Authentication

   It mounts SuperTokens endpoints at `/auth`.

2. tRPC API

   It imports a tRPC router from `@acme/api` and mounts it at `/trpc`.
