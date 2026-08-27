import type {LandingContentRepository} from "@/domain/repositories/landing-content-repository";
import type {LandingContent} from "@/domain/entities/landing-content";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetch} from "@/infrastructure/api/server-fetch";
import {pageRowsSchema} from "@/infrastructure/api/schemas/page";
import {toLandingContent} from "@/infrastructure/api/mappers/landing-content";
import {LANDING_FALLBACK} from "@/presentation/lib/landing-fallback";

export class HttpLandingContentRepository implements LandingContentRepository {
  async get(): Promise<LandingContent> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.pages.list, {
        query: {page: "home"},
        revalidateSeconds: 300,
        tags: ["pages:home"],
      });
      return toLandingContent(pageRowsSchema.parse(raw));
    } catch (error) {
      // Konten CMS bukan data kritis: backend mati tidak boleh membuat
      // landing page menampilkan halaman error — bagian keputusan #3 issue #27.
      console.error("[landing-content] gagal memuat, memakai fallback", error);
      return LANDING_FALLBACK;
    }
  }
}
