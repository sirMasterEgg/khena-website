export type ShippingZoneId =
  | "jakarta"
  | "bandung"
  | "yogyakarta"
  | "java-other"
  | "outer-islands";

export type ShippingZone = {
  id: ShippingZoneId;
  name: string;
  courier: string | null;
  /** Tarif dalam rupiah. `null` kalau butuh quote manual. */
  fee: number | null;
  freeThreshold: number | null;
  requiresQuote: boolean;
};

// Bagian 4.10 issue.md.
const ZONES: Record<ShippingZoneId, ShippingZone> = {
  jakarta: {
    id: "jakarta",
    name: "Jakarta & Surrounding",
    courier: "JNE · SiCepat",
    fee: 200_000,
    freeThreshold: 5_000_000,
    requiresQuote: false,
  },
  bandung: {
    id: "bandung",
    name: "Bandung",
    courier: "JNE",
    fee: 350_000,
    freeThreshold: 10_000_000,
    requiresQuote: false,
  },
  yogyakarta: {
    id: "yogyakarta",
    name: "Yogyakarta",
    courier: "JNE",
    fee: 400_000,
    freeThreshold: 10_000_000,
    requiresQuote: false,
  },
  "java-other": {
    id: "java-other",
    name: "Java (Other Cities)",
    courier: null,
    fee: null,
    freeThreshold: null,
    requiresQuote: true,
  },
  "outer-islands": {
    id: "outer-islands",
    name: "Outer Islands",
    courier: null,
    fee: null,
    freeThreshold: null,
    requiresQuote: true,
  },
};

const CITY_KEYWORDS: Record<Exclude<ShippingZoneId, "outer-islands">, string[]> = {
  jakarta: ["jakarta", "depok", "bekasi", "tangerang", "bogor", "cikarang", "serpong"],
  bandung: ["bandung", "cimahi"],
  yogyakarta: ["yogyakarta", "jogja", "sleman", "bantul"],
  "java-other": ["surabaya", "semarang", "malang", "solo"],
};

/** Deteksi zona ongkir dari nama kota (substring, case-insensitive). Kota tak
 * dikenal jatuh ke "Outer Islands". */
export function detectShippingZone(cityInput: string): ShippingZone {
  const city = cityInput.toLowerCase();

  for (const [zoneId, keywords] of Object.entries(CITY_KEYWORDS) as [
    Exclude<ShippingZoneId, "outer-islands">,
    string[],
  ][]) {
    if (keywords.some((keyword) => city.includes(keyword))) {
      return ZONES[zoneId];
    }
  }

  return ZONES["outer-islands"];
}
