import Link from "next/link";
import { PlainCallLink, PlainWhatsAppLink } from "@/components/cta";
import { Fillable } from "@/components/fillable";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { site } from "@/config/site";

const linkClass =
  "flex min-h-12 w-fit items-center gap-2 rounded-md font-semibold text-brand-strong underline underline-offset-4 hover:no-underline";

export function SiteFooter({ withStickyBarSpace = false }: { withStickyBarSpace?: boolean }) {
  return (
    <footer className={`mt-auto border-t border-line bg-white ${withStickyBarSpace ? "pb-24 md:pb-0" : ""}`}>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-start">
        <div className="space-y-3">
          <Logo />
          <p className="text-muted">{site.communes.join(" · ")}</p>
          <p className="text-muted">{site.domain}</p>
        </div>
        <ul className="space-y-2">
          <li>
            <PlainCallLink className={linkClass}>
              <PhoneIcon className="h-5 w-5" />
              <Fillable value={site.phone.display} />
            </PlainCallLink>
          </li>
          <li>
            <PlainWhatsAppLink className={linkClass}>
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </PlainWhatsAppLink>
          </li>
          <li>
            <Link href="/privacidad" className={linkClass}>
              Privacidad
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
