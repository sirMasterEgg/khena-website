import type {CareerDetail, CareerSummary} from "@/domain/entities/career";
import type {PageMeta} from "@/domain/entities/pagination";

export type CareerListQuery = {
  page?: number;
  limit?: number;
};

export type CareerListPage = {items: CareerSummary[]; meta: PageMeta};

/** Daftar lowongan `open` — dipanggil dari Server Component. */
export interface CareerListRepository {
  list(query: CareerListQuery): Promise<CareerListPage>;
}

/**
 * Detail satu lowongan — dipanggil dari browser saat user mengklik lowongan
 * (D3). Sengaja interface terpisah dari `CareerListRepository`: implementasinya
 * memakai transport berbeda (apiClient vs serverFetch) dan hidup di barrel
 * berbeda (D5).
 */
export interface CareerDetailRepository {
  getByIdOrSlug(idOrSlug: string, signal?: AbortSignal): Promise<CareerDetail>;
}
