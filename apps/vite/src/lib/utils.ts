import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Check if a value is a record.
 * @param value
 * @returns
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Decode a Base64 encoded JSON object.
 * @param encoded
 * @returns
 */
export const decodeBase64Json = (encoded: string | undefined) => {
  if (encoded === undefined) return {};

  const binString = atob(encoded);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
  const json = new TextDecoder().decode(bytes);

  return JSON.parse(json) as Record<string, unknown>;
};

/**
 * Encode an object to a Base64 string.
 * @param decoded
 * @returns
 */
export const encodeBase64Json = (decoded: Record<string, unknown>) => {
  const json = JSON.stringify(decoded);
  const bytes = new TextEncoder().encode(json);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
};
