import { useSyncExternalStore } from "react";
import { getUtm, type Utm } from "@/lib/utm";

const EMPTY: Utm = {};
const subscribe = () => () => {};

/** UTM params for rendering; empty during prerender and hydration. */
export function useUtm(): Utm {
  return useSyncExternalStore(subscribe, getUtm, () => EMPTY);
}
