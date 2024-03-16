import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * Initialize the database. This must be called before registering the API on
 * a server.
 */
export const initDb = async () => {
  try {
    await prisma.$connect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    throw e;
  }
  await prisma.$disconnect();
};
