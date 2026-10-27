"use client";

import { useEffect, useState } from "react";
import { WhatsAppLink } from "@/components/cta";
import { WhatsAppIcon } from "@/components/icons";

/** Mobile-only bottom bar; hides while the final CTA section is on screen. */
export function StickyBar({ hideWhenVisibleId }: { hideWhenVisibleId: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(hideWhenVisibleId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden motion-safe:transition-transform motion-safe:duration-200 ${
        hidden ? "pointer-events-none translate-y-full" : ""
      }`}
      aria-hidden={hidden || undefined}
      inert={hidden}
    >
      <WhatsAppLink location="sticky" size="md" className="w-full">
        <WhatsAppIcon className="h-6 w-6" />
        Escribir por WhatsApp
      </WhatsAppLink>
    </div>
  );
}
