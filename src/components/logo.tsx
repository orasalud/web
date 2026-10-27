import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-12 items-center gap-2 rounded-md ${className}`}
      aria-label="Orasalud, inicio"
    >
      <LogoIcon className="h-9 w-9 shrink-0" />
      <span className="text-[1.65rem] leading-none font-bold tracking-tight text-[#1A8C95]">
        orasalud
      </span>
    </Link>
  );
}
