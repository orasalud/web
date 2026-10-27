import { isPlaceholder } from "@/config/site";

/** Renders a value from site.ts, highlighted while it is still a [placeholder]. */
export function Fillable({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <mark className="rounded bg-[#FFF3BF] px-1 text-ink outline-1 outline-dashed outline-[#B08900]">
      {value}
    </mark>
  );
}
