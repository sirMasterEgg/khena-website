import type {AssemblyManual, ContractProject, QaItem, QaPageKey} from "@/domain/entities/info-content";
import {infoContentRepository} from "@/infrastructure/repositories";

export async function getQaItems(page: QaPageKey): Promise<QaItem[]> {
  return infoContentRepository.getQaItems(page);
}

export async function getAssemblyManuals(): Promise<AssemblyManual[]> {
  return infoContentRepository.getManuals();
}

export async function getContractProjects(): Promise<ContractProject[]> {
  return infoContentRepository.getContractProjects();
}
