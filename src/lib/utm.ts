export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "orasalud_utm";
const EMPTY: Utm = {};
let cached: Utm | null = null;

/**
 * Reads UTM params from the URL; if present they replace the stored set.
 * Otherwise falls back to what was stored earlier in this browser session.
 */
export function getUtm(): Utm {
  if (typeof window === "undefined") return EMPTY;
  if (cached) return cached;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) fromUrl[key] = value.slice(0, 100);
  }

  try {
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      cached = fromUrl;
    } else {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      cached = stored ? (JSON.parse(stored) as Utm) : EMPTY;
    }
  } catch {
    cached = fromUrl;
  }
  return cached;
}
