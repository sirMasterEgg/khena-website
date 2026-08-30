import type {CareerDetail} from "@/domain/entities/career";
import type {CareerDetailRepository} from "@/domain/repositories/career-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {apiClient} from "@/infrastructure/api/client";
import {toCareerDetail} from "@/infrastructure/api/mappers/career";

/**
 * Transport `apiClient` (axios), bukan `serverFetch` — detail baru diminta
 * setelah user mengklik satu lowongan di browser (D3), sama seperti
 * `HttpProductSearchRepository` untuk fitur search.
 */
export class HttpCareerDetailRepository implements CareerDetailRepository {
  async getByIdOrSlug(idOrSlug: string, signal?: AbortSignal): Promise<CareerDetail> {
    const res = await apiClient.get(API_ENDPOINTS.careers.detail(idOrSlug), {signal});
    // `res.data` = envelope {data: ...}; entity ada di `res.data.data`.
    return toCareerDetail(res.data.data);
  }
}
