import { Bandage, HeartPulse, IvBag, Syringe, type LucideIcon } from "lucide-react";
import { CallLink, PlainWhatsAppLink, WhatsAppLink } from "@/components/cta";
import { Fillable } from "@/components/fillable";
import { CheckIcon, ChevronIcon, ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { PhotoSlot } from "@/components/photo-slot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyBar } from "@/components/sticky-bar";
import { formatList, formatPrice, site, type ServiceIcon } from "@/config/site";

const FINAL_CTA_ID = "contacto";

const trustChips = [
  "Registro en Superintendencia de Salud",
  "Reporte a la familia",
  "Respuesta el mismo día",
];

const steps = [
  "Nos escribe por WhatsApp o nos llama.",
  "Coordinamos la visita con su orden médica.",
  "La enfermera va a la casa y le enviamos el reporte a la familia.",
];

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  bandage: Bandage,
  syringe: Syringe,
  "heart-pulse": HeartPulse,
  "iv-bag": IvBag,
};

// Desktop: first half of the groups in the left column, the rest on the right.
const half = Math.ceil(site.serviceGroups.length / 2);
const serviceColumns = [site.serviceGroups.slice(0, half), site.serviceGroups.slice(half)];

const sampleReport =
  "Visita de hoy, 10:30 · Curación simple realizada en pierna derecha, herida limpia y en buena evolución. Presión 128/80, pulso 72, saturación 97%, glicemia 112 mg/dL. Próxima visita: jueves 10:30.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: site.name,
  url: site.url,
  telephone: site.phone.e164,
  areaServed: site.communes.map((name) => ({ "@type": "City", name })),
  openingHours: site.hours.flatMap((h) => (h.schema ? [h.schema] : [])),
};

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[1.75rem] leading-tight font-bold sm:text-4xl">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />

      <main>
        {/* Hero: text, then photo, then chips on mobile; photo beside the text on desktop. */}
        <section className="bg-tint">
          <div className="mx-auto grid max-w-5xl gap-x-10 px-4 pt-8 pb-10 [grid-template-areas:'text'_'photo'_'chips'] sm:px-6 sm:pt-14 sm:pb-16 md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:[grid-template-areas:'text_photo'_'chips_photo']">
            <div className="[grid-area:text]">
              <h1 className="text-[2.15rem] leading-[1.15] font-bold sm:text-5xl">
                Enfermera a domicilio en San Bernardo
              </h1>
              <p className="mt-2 max-w-2xl text-lg font-medium text-ink md:text-xl">
                También atendemos en {formatList(site.communes.slice(1))}.
              </p>
              <p className="mt-5 max-w-[34ch] text-base leading-[1.55] font-normal text-muted md:text-lg">
                Enfermeras con experiencia y registro en la Superintendencia de Salud. Después de cada
                visita, le enviamos un reporte a la familia.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <WhatsAppLink location="hero" size="lg" className="w-full sm:w-auto md:w-full lg:w-auto">
                  <WhatsAppIcon className="h-7 w-7" />
                  Escribir por WhatsApp
                </WhatsAppLink>
                <CallLink location="hero" size="lg" className="w-full sm:w-auto md:w-full lg:w-auto">
                  <PhoneIcon className="h-6 w-6" />
                  Llamar
                </CallLink>
              </div>
            </div>
            <PhotoSlot
              photo={site.photos.hero}
              ratio="4:3"
              sizes="(min-width: 768px) 416px, calc(100vw - 32px)"
              highPriority
              className="mt-7 [grid-area:photo] md:mt-0"
            />
            <ul className="mt-7 flex flex-wrap gap-2 [grid-area:chips] md:self-start">
              {trustChips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink"
                >
                  <CheckIcon className="h-4 w-4 shrink-0 text-brand-strong" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Services: grouped price list. Each row is one WhatsApp link. */}
        <section aria-labelledby="servicios" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading id="servicios">¿Qué necesita?</SectionHeading>
          <p className="mt-3 max-w-2xl text-muted">
            Atendemos con indicación médica cuando el procedimiento lo requiere.
          </p>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-x-14">
            {serviceColumns.map((groups, column) => (
              <div key={column} className="space-y-10">
                {groups.map((group) => {
                  const Icon = serviceIcons[group.icon];
                  return (
                    <div key={group.id}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint">
                          <Icon className="h-6 w-6 text-brand-strong" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <h3 className="text-xl font-bold">{group.title}</h3>
                      </div>
                      <ul className="-mx-3 mt-3 divide-y divide-line border-y border-line">
                        {site.services
                          .filter((service) => service.group === group.id)
                          .map((service) => (
                            <li key={service.slug}>
                              <PlainWhatsAppLink
                                location="service"
                                service={service}
                                className="grid min-h-14 grid-cols-[1fr_auto_auto] items-center gap-x-3 rounded-md px-3 py-3 hover:bg-tint focus-visible:[outline-offset:-3px] motion-safe:transition-colors"
                              >
                                {/* sr-only parts make the link read "Consultar por {title}, {subtitle}, {price}, por WhatsApp". */}
                                <span className="min-w-0">
                                  <span className="block leading-snug font-semibold text-ink">
                                    <span className="sr-only">Consultar por </span>
                                    {service.title}
                                    <span className="sr-only">,</span>
                                  </span>
                                  <span className="mt-0.5 block text-sm text-muted">
                                    {service.subtitle}
                                    <span className="sr-only">,</span>
                                  </span>
                                </span>
                                <span className="text-right text-lg font-bold text-ink tabular-nums">
                                  {formatPrice(service.price)}
                                  <span className="sr-only">, por WhatsApp</span>
                                </span>
                                <WhatsAppIcon className="h-5 w-5 text-brand-strong" />
                              </PlainWhatsAppLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">Precios en pesos chilenos, referenciales.</p>
        </section>

        {/* How it works */}
        <section aria-labelledby="asi-funciona" className="bg-tint">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeading id="asi-funciona">Así funciona</SectionHeading>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-4 rounded-2xl bg-white p-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-strong text-lg font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1.5 text-ink">{step}</p>
                </li>
              ))}
            </ol>
            <div className={`mt-4 grid gap-4 ${site.photos.kit ? "grid-cols-2" : "max-w-xl"}`}>
              <PhotoSlot
                photo={site.photos.procedure}
                ratio="3:2"
                sizes={site.photos.kit ? "(min-width: 1024px) 480px, 50vw" : "(min-width: 640px) 576px, 100vw"}
              />
              <PhotoSlot photo={site.photos.kit} ratio="3:2" sizes="(min-width: 1024px) 480px, 50vw" />
            </div>
          </div>
        </section>

        {/* Nurse */}
        <section aria-labelledby="quien-va" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading id="quien-va">Quién va a la casa</SectionHeading>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <PhotoSlot
              photo={site.photos.nurse}
              ratio="1:1"
              sizes="(min-width: 640px) 224px, 192px"
              className="w-48 shrink-0 sm:w-56"
            />
            <div>
              <p className="text-2xl font-bold text-ink">
                <Fillable value={site.nurse.name} />
              </p>
              <p className="text-lg text-ink">Enfermera</p>
              <p className="mt-2">
                Registro Superintendencia de Salud N° <Fillable value={site.nurse.registry} />
              </p>
              <p className="mt-2">
                <Fillable value={site.nurse.experience} />
              </p>
            </div>
          </div>
        </section>

        {/* Sample report */}
        <section aria-labelledby="reporte" className="bg-tint">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeading id="reporte">El reporte que recibe la familia</SectionHeading>
            <figure className="mt-6 max-w-md rounded-2xl bg-[#EFEAE2] p-4 sm:p-5">
              <figcaption className="mb-3">
                <span className="inline-block rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white">
                  Ejemplo
                </span>
              </figcaption>
              <div className="relative rounded-2xl rounded-tl-sm bg-[#D9FDD3] p-4 text-[#1F2C2F] shadow-[0_1px_1px_rgba(0,0,0,0.12)]">
                <p>{sampleReport}</p>
              </div>
            </figure>
          </div>
        </section>

        {/* Coverage & hours */}
        <section aria-labelledby="cobertura" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading id="cobertura">Cobertura y horario</SectionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-4 rounded-2xl border border-line p-5">
              <PinIcon className="mt-0.5 h-7 w-7 shrink-0 text-brand-strong" />
              <ul className="space-y-1 text-lg font-semibold text-ink">
                {site.communes.map((commune) => (
                  <li key={commune}>{commune}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 rounded-2xl border border-line p-5">
              <ClockIcon className="mt-0.5 h-7 w-7 shrink-0 text-brand-strong" />
              <ul className="space-y-1 text-lg text-ink">
                {site.hours.map((h) => (
                  <li key={h.label}>{h.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="preguntas" className="bg-tint">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeading id="preguntas">Preguntas frecuentes</SectionHeading>
            <div className="mt-6 space-y-3">
              {site.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-line bg-white">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-3 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronIcon className="h-6 w-6 shrink-0 text-brand-strong group-open:rotate-180 motion-safe:transition-transform" />
                  </summary>
                  <p className="px-5 pb-5">
                    <Fillable value={faq.answer} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id={FINAL_CTA_ID} aria-labelledby="coordinamos" className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading id="coordinamos">¿Coordinamos una visita?</SectionHeading>
          <WhatsAppLink location="final" size="lg" className="mt-6 w-full">
            <WhatsAppIcon className="h-7 w-7" />
            Escribir por WhatsApp
          </WhatsAppLink>

          <div className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h3 className="mb-5 text-2xl font-bold">¿Prefiere que lo llamemos?</h3>
            <LeadForm />
          </div>
        </section>
      </main>

      <SiteFooter withStickyBarSpace />
      <StickyBar hideWhenVisibleId={FINAL_CTA_ID} />
    </>
  );
}
