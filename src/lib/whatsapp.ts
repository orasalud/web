import { site } from "@/config/site";
import type { Utm } from "@/lib/utm";

export const GENERIC_MESSAGE =
  "Hola, quiero consultar por un servicio de enfermería a domicilio.";

/** "¿Qué necesita?" footer button: several procedures in one visit. */
export const MULTI_SERVICE_MESSAGE = `${GENERIC_MESSAGE} Necesito más de un procedimiento.`;

export function serviceMessage(serviceTitle: string): string {
  return `Hola, quiero consultar por ${serviceTitle}.`;
}

export function whatsappUrl(message: string, utm: Utm = {}): string {
  const text = utm.utm_source ? `${message} (vía ${utm.utm_source})` : message;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
