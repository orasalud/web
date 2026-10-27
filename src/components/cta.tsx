"use client";

import type { ReactNode } from "react";
import { site, type Service } from "@/config/site";
import { track, type CtaLocation } from "@/lib/analytics";
import { useUtm } from "@/lib/use-utm";
import { GENERIC_MESSAGE, serviceMessage, whatsappUrl } from "@/lib/whatsapp";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold motion-safe:transition-colors";

export const buttonStyles = {
  primary: `${base} bg-brand-strong text-white hover:bg-[#0E646B] active:bg-[#0B5257]`,
  secondary: `${base} border-2 border-brand-strong bg-white text-brand-strong hover:bg-tint`,
};

const sizes = {
  sm: "min-h-12 px-4 text-base",
  md: "min-h-14 px-6 text-lg",
  lg: "min-h-16 px-7 text-xl",
};

type CommonProps = {
  location: CtaLocation;
  variant?: keyof typeof buttonStyles;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

export function WhatsAppLink({
  location,
  service,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: CommonProps & { service?: Service }) {
  const utm = useUtm();
  const message = service ? serviceMessage(service.title) : GENERIC_MESSAGE;

  return (
    <a
      href={whatsappUrl(message, utm)}
      target="_blank"
      rel="noopener"
      className={`${buttonStyles[variant]} ${sizes[size]} ${className}`}
      onClick={() => track("whatsapp_click", { location, service: service?.slug })}
    >
      {children}
    </a>
  );
}

export function CallLink({
  location,
  variant = "secondary",
  size = "md",
  className = "",
  children,
}: CommonProps) {
  return (
    <a
      href={`tel:${site.phone.e164}`}
      className={`${buttonStyles[variant]} ${sizes[size]} ${className}`}
      onClick={() => track("call_click", { location })}
    >
      {children}
    </a>
  );
}

/** Unstyled tracked links, for the footer. */
export function PlainWhatsAppLink({ className, children }: { className?: string; children: ReactNode }) {
  const utm = useUtm();
  return (
    <a
      href={whatsappUrl(GENERIC_MESSAGE, utm)}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => track("whatsapp_click", { location: "footer" })}
    >
      {children}
    </a>
  );
}

export function PlainCallLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href={`tel:${site.phone.e164}`}
      className={className}
      onClick={() => track("call_click", { location: "footer" })}
    >
      {children}
    </a>
  );
}
