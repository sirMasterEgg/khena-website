import type {InfoContentRepository} from "@/domain/repositories/info-content-repository";
import type {AssemblyManual, ContractProject, QaItem, QaPageKey} from "@/domain/entities/info-content";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetch} from "@/infrastructure/api/server-fetch";
import {pageRowsSchema} from "@/infrastructure/api/schemas/page";
import {toAssemblyManuals, toContractProjects, toQaItems} from "@/infrastructure/api/mappers/info-content";

/**
 * Konten CMS halaman /info/[slug] — bagian Fase 7-9 issue #27. Sama seperti
 * `HttpLandingContentRepository`, error ditelan (konten bukan data kritis):
 * halaman tetap render dengan empty state, bukan error page.
 */
export class HttpInfoContentRepository implements InfoContentRepository {
  async getQaItems(page: QaPageKey): Promise<QaItem[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.pages.list, {
        query: {page, section: "items"},
        revalidateSeconds: 300,
        tags: [`pages:${page}`],
      });
      return toQaItems(pageRowsSchema.parse(raw));
    } catch (error) {
      console.error(`[info-content] gagal memuat qa items "${page}"`, error);
      return [];
    }
  }

  async getManuals(): Promise<AssemblyManual[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.pages.list, {
        query: {page: "assembly", section: "manuals"},
        revalidateSeconds: 300,
        tags: ["pages:assembly"],
      });
      return toAssemblyManuals(pageRowsSchema.parse(raw));
    } catch (error) {
      console.error("[info-content] gagal memuat assembly manuals", error);
      return [];
    }
  }

  async getContractProjects(): Promise<ContractProject[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.pages.list, {
        query: {page: "contract", section: "projects"},
        revalidateSeconds: 300,
        tags: ["pages:contract"],
      });
      return toContractProjects(pageRowsSchema.parse(raw));
    } catch (error) {
      console.error("[info-content] gagal memuat contract projects", error);
      return [];
    }
  }
}
