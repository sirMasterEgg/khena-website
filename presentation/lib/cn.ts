export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassValue[];

/**
 * Penggabung className ringan, tanpa dependensi tambahan (lihat bagian 1.7
 * issue.md — varian komponen dikelola dengan objek pemetaan sederhana, bukan
 * library seperti clsx/tailwind-merge). Menerima string, angka, array
 * bersarang, dan objek kondisional, lalu membuang nilai falsy.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      continue;
    }

    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
      continue;
    }

    for (const key in input) {
      if (input[key]) classes.push(key);
    }
  }

  return classes.join(" ");
}
