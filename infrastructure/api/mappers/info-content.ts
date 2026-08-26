import {
  assemblyManualsSectionSchema,
  contractProjectsSectionSchema,
  findSectionData,
  type PageRow,
  qaItemsSectionSchema,
} from "@/infrastructure/api/schemas/page";
import type {AssemblyManual, ContractProject, QaItem} from "@/domain/entities/info-content";

/** `faq`/`care`/`shipping`/`returns`, section `items` — bentuknya identik. */
export function toQaItems(rows: PageRow[]): QaItem[] {
  const parsed = qaItemsSectionSchema.safeParse(findSectionData(rows, "items"));
  const items = parsed.success ? (parsed.data.items ?? []) : [];

  return items
    .filter((item) => Boolean(item.question))
    .map((item) => ({
      id: item.id ?? "",
      question: item.question ?? "",
      answer: item.answer ?? "",
      category: item.category ?? "",
      updatedAt: item.updatedAt ?? "",
    }));
}

/** `assembly`, section `manuals`. */
export function toAssemblyManuals(rows: PageRow[]): AssemblyManual[] {
  const parsed = assemblyManualsSectionSchema.safeParse(findSectionData(rows, "manuals"));
  const manuals = parsed.success ? (parsed.data.manuals ?? []) : [];

  // Buang item tanpa fileUrl — tanpa URL, barisnya tidak bisa diapa-apakan.
  return manuals
    .filter((manual) => Boolean(manual.fileUrl))
    .map((manual) => ({
      id: manual.id ?? "",
      fileUrl: manual.fileUrl ?? "",
      fileName: manual.fileName ?? "",
      fileSize: manual.fileSize ?? "",
      productSku: manual.productSku ?? "",
      productName: manual.productName ?? "",
      updatedAt: manual.updatedAt ?? "",
    }));
}

/** `contract`, section `projects`. */
export function toContractProjects(rows: PageRow[]): ContractProject[] {
  const parsed = contractProjectsSectionSchema.safeParse(findSectionData(rows, "projects"));
  const projects = parsed.success ? (parsed.data.projects ?? []) : [];

  // status di dalam array beda dari status baris `pages` (sudah difilter
  // backend) — proyek draft di dalam baris published wajib disaring di sini.
  return projects
    .filter((project) => project.status === "published")
    .map((project) => ({
      id: project.id ?? "",
      field: project.field ?? "",
      description: project.description ?? "",
      updatedAt: project.updatedAt ?? "",
    }));
}
