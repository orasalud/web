import { site } from "@/config/site";
import { UTM_KEYS, type Utm } from "@/lib/utm";

export const OTHER_SERVICE = { slug: "otro", title: "Otro" } as const;

export const serviceOptions = [
  ...site.services.map(({ slug, title }) => ({ slug, title })),
  OTHER_SERVICE,
];

export type Lead = {
  name: string;
  phone: string;
  service: { slug: string; title: string } | null;
  utm: Utm;
  pageUrl: string | null;
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Validates the raw JSON body sent by the form. Returns null when invalid. */
export function parseLead(body: unknown): Lead | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  const name = clean(raw.name, 80);
  const phone = clean(raw.phone, 30);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return null;
  if (!/^[+\d\s().-]+$/.test(phone) || digits.length < 8 || digits.length > 15) return null;

  const serviceSlug = clean(raw.service, 60);
  const service = serviceOptions.find((option) => option.slug === serviceSlug) ?? null;
  if (serviceSlug && !service) return null;

  const utm: Utm = {};
  const rawUtm = raw.utm && typeof raw.utm === "object" ? (raw.utm as Record<string, unknown>) : {};
  for (const key of UTM_KEYS) {
    const value = clean(rawUtm[key], 100);
    if (value) utm[key] = value;
  }

  let pageUrl: string | null = null;
  try {
    const url = new URL(clean(raw.pageUrl, 500));
    if (url.protocol === "https:" || url.protocol === "http:") pageUrl = url.toString();
  } catch {
    pageUrl = null;
  }

  return { name, phone, service, utm, pageUrl };
}
