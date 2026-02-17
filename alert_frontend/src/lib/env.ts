/**
 * Environment helpers for the frontend.
 *
 * Note: next.config.ts uses `output: "export"`, so this app runs fully client-side.
 * Use NEXT_PUBLIC_* env vars only.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /**
   * Returns the base URL for the FastAPI backend.
   *
   * Configure:
   * - NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:3001)
   */
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/+$/, "") : "http://localhost:3001";
}
