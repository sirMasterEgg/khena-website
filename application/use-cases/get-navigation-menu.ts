import type {NavigationMenu} from "@/domain/entities/navigation";
import {navigationRepository} from "@/infrastructure/repositories";
import {NAVIGATION_FALLBACK} from "@/presentation/lib/navigation-fallback";

/**
 * Data dropdown navbar. Tidak pernah melempar: navbar ada di root layout, jadi
 * kegagalan di sini tidak boleh mengubah seluruh situs jadi halaman error.
 */
export async function getNavigationMenu(): Promise<NavigationMenu> {
  try {
    return await navigationRepository.get();
  } catch (error) {
    console.error("[navigation] gagal memuat menu, memakai fallback kosong", error);
    return NAVIGATION_FALLBACK;
  }
}
