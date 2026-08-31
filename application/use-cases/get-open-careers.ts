import type {CareerListPage, CareerListQuery} from "@/domain/repositories/career-repository";
import {careerRepository} from "@/infrastructure/repositories";

/**
 * Lowongan untuk `/info/career`.
 *
 * Tidak memfilter status: endpoint publik hanya mengirim lowongan `open`
 * (contract.md Bagian 30) — beda dari `getOpenJobs()` lama yang memfilter data
 * mock di frontend.
 *
 * Sengaja melempar bila API gagal: yang menangkap adalah halaman, supaya bisa
 * membedakan "lowongan gagal dimuat" dari "belum ada lowongan" (D8).
 */
export async function getOpenCareers(query: CareerListQuery = {}): Promise<CareerListPage> {
  return careerRepository.list(query);
}
