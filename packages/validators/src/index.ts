import { z } from "zod";

/**
 * A Zod schema for validating a password.
 */
export const validatePassword = z
  .string()
  .min(8, "Password must be at least 8 characters long");
