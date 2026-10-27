import type { PostHog } from "posthog-js";
import { getUtm } from "@/lib/utm";

export type CtaLocation = "header" | "hero" | "service" | "sticky" | "final" | "footer";

type Events = {
  whatsapp_click: { location: CtaLocation; service?: string };
  call_click: { location: CtaLocation };
  lead_form_submit: { service: string };
};

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let client: Promise<PostHog | null> | null = null;

// PostHog is only downloaded on the first tracked event, so it never
// competes with the initial page load.
function load(): Promise<PostHog | null> {
  if (!KEY) return Promise.resolve(null);
  client ??= import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_performance: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_exceptions: false,
        rageclick: false,
        disable_session_recording: true,
        disable_surveys: true,
        disable_web_experiments: true,
        disable_external_dependency_loading: true,
        advanced_disable_flags: true,
        request_batching: false,
      });
      return posthog;
    })
    .catch(() => null);
  return client;
}

export function track<E extends keyof Events>(event: E, properties: Events[E]): void {
  if (!KEY) return;
  const { utm_source, utm_medium, utm_campaign } = getUtm();
  const utm = Object.fromEntries(
    Object.entries({ utm_source, utm_medium, utm_campaign }).filter(([, v]) => v),
  );
  load()
    .then((posthog) => posthog?.capture(event, { ...properties, ...utm }))
    .catch(() => {});
}
