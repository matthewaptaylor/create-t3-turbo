import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * Initialize the database.
 */
export const initDb = async () => {
  try {
    // ... you will write your Prisma Client queries here
    await prisma.$connect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    throw e;
  }
  await prisma.$disconnect();
};
