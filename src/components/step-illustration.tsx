"use client";

import { useEffect, useRef } from "react";
import "./step-illustration.css";

export type StepIllustrationKind = "chat" | "schedule" | "route" | "report";

const BRAND = "#32BDC7";
const BRAND_STRONG = "#127A82";
const INK = "#17323A";
const TINT = "#E9F7F8";
const WHITE = "#FFFFFF";
const CHAT_GREEN = "#DCF8C6";

/**
 * Decorative, play-once illustration for an "Así funciona" step. The step text
 * next to it is the accessible content, so the whole thing is aria-hidden.
 */
export function StepIllustration({ kind }: { kind: StepIllustrationKind }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const play = () => {
      el.dataset.state = "play";
    };
    if (!("IntersectionObserver" in window)) return play();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="ill-frame" data-state="idle" aria-hidden="true">
      <svg viewBox="0 0 280 160" preserveAspectRatio="xMidYMid meet" focusable="false">
        {kind === "chat" && <Chat />}
        {kind === "schedule" && <Schedule />}
        {kind === "route" && <Route />}
        {kind === "report" && <Report />}
      </svg>
    </div>
  );
}

function Chat() {
  return (
    <>
      <g className="ill-chat-out">
        <rect x="100" y="14" width="164" height="48" rx="12" fill={CHAT_GREEN} />
        <text x="112" y="34" fontSize="12" fill={INK}>
          Hola, mi mamá necesita
        </text>
        <text x="112" y="50" fontSize="12" fill={INK}>
          una curación.
        </text>
        <path
          d="M233 50l3 3 6-6M239 50l3 3 6-6"
          fill="none"
          stroke={BRAND_STRONG}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className="ill-typing">
        <rect x="16" y="72" width="54" height="28" rx="12" fill={WHITE} />
        <circle className="ill-dot" cx="31" cy="86" r="3.2" fill={BRAND_STRONG} />
        <circle className="ill-dot" cx="43" cy="86" r="3.2" fill={BRAND_STRONG} />
        <circle className="ill-dot" cx="55" cy="86" r="3.2" fill={BRAND_STRONG} />
      </g>

      <g className="ill-chat-in">
        <rect x="16" y="72" width="164" height="48" rx="12" fill={WHITE} />
        <text x="28" y="92" fontSize="12" fill={INK}>
          ¡Hola! Claro, ¿qué día
        </text>
        <text x="28" y="108" fontSize="12" fill={INK}>
          le acomoda?
        </text>
      </g>

      {/* Static input bar */}
      <rect x="16" y="130" width="218" height="22" rx="11" fill={WHITE} />
      <circle cx="252" cy="141" r="12" fill={BRAND_STRONG} />
      <path d="M247 141h9m-4-4 4 4-4 4" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const DAYS = ["L", "M", "M", "J", "V", "S"];
const SELECTED_DAY = 3; // J
const CHIPS = [
  { label: "9:30", x: 44, width: 52 },
  { label: "10:30", x: 106, width: 60 },
  { label: "16:00", x: 176, width: 60 },
];
const SELECTED_CHIP = 1; // 10:30

function Schedule() {
  const dayX = (i: number) => 45 + i * 38;
  const chip = CHIPS[SELECTED_CHIP];
  return (
    <>
      <rect x="14" y="8" width="252" height="144" rx="14" fill={WHITE} />

      {DAYS.map((day, i) => (
        <g key={i}>
          <circle cx={dayX(i)} cy="36" r="14" fill={TINT} />
          <text x={dayX(i)} y="36" fontSize="12" fontWeight="600" fill={INK} textAnchor="middle" dominantBaseline="central">
            {day}
          </text>
        </g>
      ))}
      <g className="ill-day-sel">
        <circle cx={dayX(SELECTED_DAY)} cy="36" r="14" fill={BRAND_STRONG} />
        <text x={dayX(SELECTED_DAY)} y="36" fontSize="12" fontWeight="700" fill={WHITE} textAnchor="middle" dominantBaseline="central">
          {DAYS[SELECTED_DAY]}
        </text>
      </g>

      <g>
        {CHIPS.map((c) => (
          <g key={c.label} className="ill-chip">
            <rect x={c.x} y="66" width={c.width} height="26" rx="13" fill={WHITE} stroke={BRAND_STRONG} strokeWidth="1.5" />
            <text x={c.x + c.width / 2} y="79" fontSize="12" fontWeight="600" fill={BRAND_STRONG} textAnchor="middle" dominantBaseline="central">
              {c.label}
            </text>
          </g>
        ))}
      </g>
      <g className="ill-chip-sel">
        <rect x={chip.x} y="66" width={chip.width} height="26" rx="13" fill={BRAND_STRONG} stroke={BRAND_STRONG} strokeWidth="1.5" />
        <text x={chip.x + chip.width / 2} y="79" fontSize="12" fontWeight="700" fill={WHITE} textAnchor="middle" dominantBaseline="central">
          {chip.label}
        </text>
      </g>

      <g className="ill-done">
        <circle cx="84" cy="122" r="10" fill={BRAND} />
        <path d="M79.5 122l3 3 6-6" fill="none" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="101" y="122" fontSize="13" fontWeight="700" fill={INK} dominantBaseline="central">
          Visita agendada
        </text>
      </g>
    </>
  );
}

function Route() {
  return (
    // Shifted up so the scene sits in the middle of the frame.
    <g transform="translate(0 -14)">
      <path d="M16 126H206" fill="none" stroke={BRAND_STRONG} strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.55" />

      {/* House: same shape as the logo icon */}
      <g className="ill-house">
        <g transform="translate(206 80)">
          <path
            d="M6 22 L24 8 L42 22 V39 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z"
            fill={WHITE}
            stroke={BRAND_STRONG}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M24 23 V35 M18 29 H30" stroke={BRAND_STRONG} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Car + label, drawn at the start position and moved with CSS */}
      <g className="ill-car">
        <g className="ill-label-go">
          <rect x="16" y="70" width="122" height="22" rx="11" fill={WHITE} />
          <text x="77" y="81" fontSize="11" fontWeight="600" fill={INK} textAnchor="middle" dominantBaseline="central">
            Enfermera en camino
          </text>
        </g>
        {/* Right-aligned with the car's front so it stops clear of the house. */}
        <g className="ill-label-arrived">
          <rect x="-26" y="70" width="100" height="22" rx="11" fill={BRAND_STRONG} />
          <text x="24" y="81" fontSize="11" fontWeight="700" fill={WHITE} textAnchor="middle" dominantBaseline="central">
            Llegó a la casa
          </text>
        </g>

        <path d="M28 106 L35 97 Q36 96 37.5 96 H57 Q58.5 96 59.5 97 L66 106 Z" fill={BRAND} />
        <rect x="18" y="105" width="56" height="16" rx="5" fill={BRAND} />
        <path d="M37 99.5 H45 V105 H33.5 Z" fill={WHITE} />
        <path d="M48 99.5 H56.5 L60 105 H48 Z" fill={WHITE} />
        <rect x="44.5" y="108" width="3" height="10" rx="1" fill={WHITE} />
        <rect x="41" y="111.5" width="10" height="3" rx="1" fill={WHITE} />
        <circle cx="30" cy="121" r="5.5" fill={INK} />
        <circle cx="30" cy="121" r="2" fill={WHITE} />
        <circle cx="62" cy="121" r="5.5" fill={INK} />
        <circle cx="62" cy="121" r="2" fill={WHITE} />
      </g>
    </g>
  );
}

function Report() {
  return (
    <>
      <g className="ill-report-bubble">
        <rect x="16" y="12" width="236" height="108" rx="12" fill={WHITE} />
        {/* Clipboard icon + header */}
        <rect x="28" y="23" width="12" height="15" rx="2" fill="none" stroke={BRAND_STRONG} strokeWidth="1.6" />
        <path d="M31 23v-1.5h6V23M31 29h6M31 33h4" fill="none" stroke={BRAND_STRONG} strokeWidth="1.6" strokeLinecap="round" />
        <text x="46" y="31" fontSize="12" fontWeight="700" fill={BRAND_STRONG} dominantBaseline="central">
          Reporte de la visita
        </text>
        <path d="M28 46H240" stroke={TINT} strokeWidth="1.5" />
      </g>
      <g>
        <text className="ill-report-line" x="28" y="64" fontSize="11.5" fill={INK}>
          Curación realizada, herida limpia.
        </text>
        <text className="ill-report-line" x="28" y="82" fontSize="11.5" fill={INK}>
          Presión 128/80 · Saturación 97%
        </text>
        <text className="ill-report-line" x="28" y="100" fontSize="11.5" fill={INK}>
          Próxima visita: jueves 10:30
        </text>
      </g>
      <path
        className="ill-report-check"
        d="M222 108l3 3 6-6M228 108l3 3 6-6"
        fill="none"
        stroke={BRAND_STRONG}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Static input bar */}
      <rect x="16" y="130" width="218" height="22" rx="11" fill={WHITE} />
      <circle cx="252" cy="141" r="12" fill={BRAND_STRONG} />
      <path d="M247 141h9m-4-4 4 4-4 4" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}
