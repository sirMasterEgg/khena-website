/** "Rp 1.500.000" (default id-ID) -> "IDR 1.500.000" sesuai desain — bagian 2.5 issue.md. */
export function formatIDR(amount: number): string {
  const grouped = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/^\D+/, "");

  return `IDR ${grouped}`;
}

const DIMENSION_ORDER = ["w", "d", "h"];
const DIMENSION_LABELS: Record<string, string> = {w: "W", d: "D", h: "H"};

/** `{ w: 220, d: 90, h: 75 }` -> `"W 220 × D 90 × H 75 cm"`. */
export function formatDimensions(dimensions: Record<string, string | number>): string {
  const keys = Object.keys(dimensions);
  const orderedKeys = [
    ...DIMENSION_ORDER.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !DIMENSION_ORDER.includes(key)),
  ];

  const parts = orderedKeys.map((key) => {
    const label = DIMENSION_LABELS[key] ?? key.toUpperCase();
    return `${label} ${dimensions[key]}`;
  });

  return `${parts.join(" × ")} cm`;
}
