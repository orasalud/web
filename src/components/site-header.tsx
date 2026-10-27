import { WhatsAppLink } from "@/components/cta";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Logo />
        <WhatsAppLink location="header" size="sm">
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </WhatsAppLink>
      </div>
    </header>
  );
}
