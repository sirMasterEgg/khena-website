import type {ProductSearchRepository} from "@/domain/repositories/product-search-repository";
import type {CareerDetailRepository} from "@/domain/repositories/career-repository";
import {HttpProductSearchRepository} from "@/infrastructure/repositories/http-product-search-repository";
import {HttpCareerDetailRepository} from "@/infrastructure/repositories/http-career-detail-repository";

/**
 * Barrel TERPISAH dari `infrastructure/repositories/index.ts` — barrel utama
 * itu mengimpor repository yang lewat `serverFetch.ts` (`import "server-only"`)
 * secara statis, jadi mengimpor apa pun darinya dari komponen `"use client"`
 * ikut menarik kode server-only ke bundle browser dan build gagal.
 *
 * Isi berkas ini khusus repository yang aman & memang dipanggil langsung dari
 * client (transport `apiClient`, bukan `serverFetch`) — `productSearchRepository`
 * untuk fitur search product, `careerDetailRepository` untuk detail lowongan
 * (issue #36, D5).
 */
export const productSearchRepository: ProductSearchRepository = new HttpProductSearchRepository();

export const careerDetailRepository: CareerDetailRepository = new HttpCareerDetailRepository();
