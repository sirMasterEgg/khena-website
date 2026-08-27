import type {AssemblyManual, ContractProject, QaItem, QaPageKey} from "@/domain/entities/info-content";

export interface InfoContentRepository {
  getQaItems(page: QaPageKey): Promise<QaItem[]>;
  getManuals(): Promise<AssemblyManual[]>;
  getContractProjects(): Promise<ContractProject[]>;
}
