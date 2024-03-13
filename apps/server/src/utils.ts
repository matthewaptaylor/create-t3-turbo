/**
 * Check if a value is a record.
 * @param value
 * @returns
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
