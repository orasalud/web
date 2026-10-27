"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonStyles } from "@/components/cta";
import { track } from "@/lib/analytics";
import { serviceOptions } from "@/lib/lead";
import { getUtm } from "@/lib/utm";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "block min-h-12 w-full rounded-xl border-2 border-[#7F8D92] bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus:border-brand-strong";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const successRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    const service = String(data.get("service") ?? "");
    setStatus("sending");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          service,
          website: data.get("website"),
          utm: getUtm(),
          pageUrl: window.location.href,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      track("lead_form_submit", { service: service || "sin_especificar" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border-2 border-brand-strong bg-tint p-6 text-center text-xl font-semibold text-ink"
      >
        Gracias, lo llamaremos pronto.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="lead-name" className="mb-1.5 block font-semibold text-ink">
          Nombre
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="lead-phone" className="mb-1.5 block font-semibold text-ink">
          Teléfono
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          required
          minLength={8}
          maxLength={30}
          inputMode="tel"
          autoComplete="tel"
          placeholder="+56 9 ..."
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="lead-service" className="mb-1.5 block font-semibold text-ink">
          ¿Qué necesita?
        </label>
        <select id="lead-service" name="service" defaultValue="" className={`${fieldClass} appearance-auto`}>
          <option value="">Seleccione una opción</option>
          {serviceOptions.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="lead-website">No completar</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={`${buttonStyles.primary} min-h-14 w-full px-6 text-lg disabled:opacity-70`}
      >
        {status === "sending" ? "Enviando…" : "Quiero que me llamen"}
      </button>

      {status === "error" && (
        <p role="alert" className="rounded-xl border-2 border-[#B42318] bg-[#FEF3F2] p-4 font-semibold text-[#912018]">
          No pudimos enviar su solicitud. Intente de nuevo o escríbanos por WhatsApp.
        </p>
      )}

      <p className="text-sm text-muted">Usamos sus datos solo para contactarlo por esta consulta.</p>
    </form>
  );
}
