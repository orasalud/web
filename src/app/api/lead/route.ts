import { Resend } from "resend";
import { parseLead, type Lead } from "@/lib/lead";

function formatLead(lead: Lead): string {
  const when = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  const utm = Object.entries(lead.utm)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join("\n");

  return [
    "Nueva solicitud de llamada desde orasalud.com",
    "",
    `Nombre: ${lead.name}`,
    `Teléfono: ${lead.phone}`,
    `Servicio: ${lead.service?.title ?? "No indicado"}`,
    "",
    `Fecha: ${when}`,
    `Página: ${lead.pageUrl ?? "-"}`,
    `UTM:${utm ? `\n${utm}` : " -"}`,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot filled: pretend success so bots don't retry.
  const honeypot = (body as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return Response.json({ ok: true });
  }

  const lead = parseLead(body);
  if (!lead) {
    return Response.json({ ok: false, error: "invalid_lead" }, { status: 400 });
  }

  const text = formatLead(lead);
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !to) {
    console.info(`[lead] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set; logging lead instead:\n${text}`);
    if (process.env.NODE_ENV === "production") {
      // Don't tell a real visitor "we'll call you" when nobody received the lead.
      return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
    }
    return Response.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.LEAD_FROM_EMAIL || "Orasalud <onboarding@resend.dev>",
    to: to.split(",").map((address) => address.trim()),
    subject: `Llamar a ${lead.name}${lead.service ? ` · ${lead.service.title}` : ""}`,
    text,
  });

  if (error) {
    console.error("[lead] Resend error:", error, `\n${text}`);
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
