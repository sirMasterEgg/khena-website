// Palet swatch warna PDP (galeri Pantone) — bagian 4.5 issue.md.

export type ColorSwatchKey = "walnut" | "natural" | "ash" | "stone";

export type ColorSwatch = {
  key: ColorSwatchKey;
  label: string;
  /** Warna latar kartu galeri saat swatch ini dipilih. */
  cardBackground: string;
  /** Warna kotak kecil pada chip swatch. */
  chipColor: string;
};

export const COLOR_SWATCHES: Record<ColorSwatchKey, ColorSwatch> = {
  walnut: {key: "walnut", label: "Walnut", cardBackground: "#EDE6DC", chipColor: "#39302A"},
  natural: {key: "natural", label: "Natural", cardBackground: "#F1E3CB", chipColor: "#C7A47D"},
  ash: {key: "ash", label: "Ash", cardBackground: "#E8E3DA", chipColor: "#9F8F7A"},
  stone: {key: "stone", label: "Stone", cardBackground: "#E4E2DD", chipColor: "#7D7B74"},
};
