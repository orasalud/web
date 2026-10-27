import type { Metadata } from "next";
import { Fillable } from "@/components/fillable";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacidad · Orasalud",
  description: "Cómo usamos los datos que nos deja en el formulario de orasalud.com.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <p
          role="note"
          className="mb-6 rounded-xl border-2 border-dashed border-[#B08900] bg-[#FFF3BF] p-4 font-semibold text-ink"
        >
          Borrador: este texto está pendiente de revisión legal.
        </p>

        <h1 className="text-[2rem] leading-tight font-bold sm:text-4xl">Privacidad</h1>

        <div className="mt-6 space-y-8 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          <section className="space-y-3">
            <h2>Qué datos pedimos</h2>
            <p>Cuando usa el formulario “¿Prefiere que lo llamemos?”, nos deja:</p>
            <ul>
              <li>Su nombre.</li>
              <li>Su teléfono.</li>
              <li>El servicio que le interesa (opcional).</li>
            </ul>
            <p>
              Junto con eso guardamos la página desde la que envió el formulario y, si llegó desde un
              anuncio o un enlace, de dónde vino (por ejemplo, “google”). No le pedimos información de
              salud en el formulario.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Para qué los usamos</h2>
            <p>
              Solo para llamarlo por la consulta que nos hizo. No le enviaremos publicidad con estos
              datos.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Con quién los compartimos</h2>
            <p>
              No vendemos ni arrendamos sus datos. El formulario nos llega por correo electrónico
              mediante un proveedor de envío de correos (Resend). No guardamos sus datos en una base de
              datos del sitio.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Estadísticas del sitio</h2>
            <p>
              Contamos de forma general cuántas personas tocan los botones de WhatsApp, de llamada y
              del formulario, usando PostHog. No grabamos su pantalla ni lo que escribe.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Sus derechos</h2>
            <p>
              Puede pedirnos ver, corregir o borrar sus datos escribiéndonos a{" "}
              <Fillable value={site.contactEmail} />.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
