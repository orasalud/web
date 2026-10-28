// Single source of truth for all business data shown on the site.
// Values wrapped in [brackets] are placeholders: they render highlighted in
// yellow on the page until they are replaced with real values.

export type ServiceIcon = "bandage" | "syringe" | "heart-pulse" | "iv-bag";

export type ServiceGroupId = "curaciones" | "medicamentos" | "signos-vitales" | "sondas";

export type ServiceGroup = {
  id: ServiceGroupId;
  title: string;
  icon: ServiceIcon;
};

export type Service = {
  slug: string;
  title: string;
  subtitle: string;
  /** Price in Chilean pesos (CLP), no decimals. */
  price: number;
  group: ServiceGroupId;
};

export type Photo = {
  /** Path inside /public. Drop the file there and it shows up on the next build. */
  src: string;
  /** Describes the photo for screen readers and Google. */
  alt: string;
  /** Text on the gray box shown while the file doesn't exist yet. */
  placeholder: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export const site = {
  name: "Orasalud",
  url: "https://orasalud.com",
  domain: "orasalud.com",

  /** WhatsApp number in international format, digits only (no +, spaces or dashes). */
  whatsappNumber: "56900000000",

  phone: {
    /** Used for tel: links and structured data. International format with +. */
    e164: "+56900000000",
    /** How the number is shown on the page. */
    display: "[+56 9 XXXX XXXX]",
  },

  /** Contact email shown on /privacidad. */
  contactEmail: "[correo de contacto]",

  /**
   * Real photos only: no stock photos, AI-generated people or illustrations.
   * Exception: the hero may show hands only, with no identifiable faces.
   * Put the files in public/images/ with these names. Until a file exists, a
   * labeled gray box is shown in its place.
   */
  photos: {
    /** Hero, 4:3. Nurse with an older adult at home. */
    hero: {
      src: "/images/hero.jpg",
      alt: "Manos de una enfermera sosteniendo las manos de una persona mayor en su casa",
      placeholder: "Foto: enfermera con adulto mayor en casa",
    },
  } satisfies Record<string, Photo>,

  communes: ["San Bernardo", "Calera de Tango", "El Bosque"],

  hours: [
    { label: "Lunes a viernes 8:30 a 19:00", schema: "Mo-Fr 08:30-19:00" },
    { label: "Sábado 9:00 a 14:00", schema: "Sa 09:00-14:00" },
    { label: "Domingo cerrado", schema: null },
  ],

  /**
   * "¿Qué necesita?" groups, in display order (one column at every width).
   */
  serviceGroups: [
    { id: "curaciones", title: "Curaciones", icon: "bandage" },
    { id: "medicamentos", title: "Medicamentos", icon: "syringe" },
    { id: "signos-vitales", title: "Signos vitales", icon: "heart-pulse" },
    { id: "sondas", title: "Sondas", icon: "iv-bag" },
  ] satisfies ServiceGroup[],

  /** Order within each group follows this array (also the order in the form). */
  services: [
    {
      slug: "curacion-simple",
      title: "Curación simple",
      subtitle: "Heridas pequeñas o de operación",
      price: 25000,
      group: "curaciones",
    },
    {
      slug: "curacion-avanzada",
      title: "Curación avanzada",
      subtitle: "Úlceras, pie diabético, heridas complejas",
      price: 40000,
      group: "curaciones",
    },
    {
      slug: "administracion-medicamentos",
      title: "Administración de medicamentos",
      subtitle: "Inyecciones, con su receta médica",
      price: 20000,
      group: "medicamentos",
    },
    {
      slug: "signos-vitales-glicemia",
      title: "Signos vitales + glicemia",
      subtitle: "Presión, pulso, temperatura, saturación y glucosa",
      price: 25000,
      group: "signos-vitales",
    },
    {
      slug: "sonda-nasogastrica",
      title: "Sonda nasogástrica",
      subtitle: "Para alimentarse, con insumos",
      price: 45000,
      group: "sondas",
    },
    {
      slug: "sonda-foley",
      title: "Sonda Foley",
      subtitle: "Sonda urinaria, con insumos",
      price: 55000,
      group: "sondas",
    },
    {
      slug: "retiro-sonda",
      title: "Retiro de sonda",
      subtitle: "Foley o nasogástrica",
      price: 25000,
      group: "sondas",
    },
  ] satisfies Service[],

  /** "Preguntas frecuentes", in display order. */
  faqs: [
    {
      question: "¿Cómo sé quién va a ir?",
      answer:
        "Todas nuestras enfermeras tienen registro en la Superintendencia de Salud. Antes de la visita le enviamos el nombre y el número de registro de la enfermera que va, para que pueda verificarlo.",
    },
    {
      question: "¿Necesito orden médica?",
      answer:
        "Para inyecciones y sondas necesitamos la indicación de su médico. Para signos vitales y curaciones simples, consúltenos.",
    },
    {
      question: "¿Puedo pedir reembolso?",
      answer:
        "Entregamos boleta para que pueda solicitarlo en su isapre o seguro. La cobertura depende de su plan.",
    },
    { question: "¿Cuánto se demoran en ir?", answer: "[Por confirmar]" },
    { question: "¿Cómo se paga?", answer: "[Por confirmar]" },
  ] satisfies Faq[],
};

/** Formats a CLP amount as "$25.000". */
export function formatPrice(amount: number): string {
  return "$" + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Joins names as a Spanish list: "A, B y C" (uses "e" before an "i" sound). */
export function formatList(items: string[]): string {
  return new Intl.ListFormat("es", { type: "conjunction" }).format(items);
}

/** True for values still in [bracket] placeholder form. */
export function isPlaceholder(value: string): boolean {
  return /^\[.*\]$/.test(value.trim());
}
