import type {NavigationMenu} from "@/domain/entities/navigation";

/**
 * Navbar dirender di root layout, jadi error di sini merusak SELURUH situs.
 * Fallback-nya sengaja kosong (bukan data hardcode): link statis navbar tetap
 * berfungsi, dropdown-nya saja yang tidak punya isi — keputusan D6 issue navbar.
 */
export const NAVIGATION_FALLBACK: NavigationMenu = {
  shopGroups: [],
  collections: [],
};
