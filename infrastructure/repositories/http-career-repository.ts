import type {
  CareerListPage,
  CareerListQuery,
  CareerListRepository,
} from "@/domain/repositories/career-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetchList} from "@/infrastructure/api/server-fetch";
import {toCareerSummaries} from "@/infrastructure/api/mappers/career";
import {toPageMeta} from "@/infrastructure/api/mappers/catalog";

/** Limit besar supaya semua lowongan muat di satu halaman tanpa UI paginasi (D4). */
const DEFAULT_LIMIT = 48;

/** Selaras dengan `revalidate` halaman /info/[slug] (D9). */
const REVALIDATE_SECONDS = 300;

/** Lowongan publik /info/career — contract.md Bagian 37. */
export class HttpCareerRepository implements CareerListRepository {
  async list(query: CareerListQuery): Promise<CareerListPage> {
    const {data, meta} = await serverFetchList(API_ENDPOINTS.careers.list, {
      query: {
        page: query.page ?? 1,
        limit: query.limit ?? DEFAULT_LIMIT,
      },
      revalidateSeconds: REVALIDATE_SECONDS,
      tags: ["careers"],
    });
    return {items: toCareerSummaries(data), meta: toPageMeta(meta)};
  }
}
