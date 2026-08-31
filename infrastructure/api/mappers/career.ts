import type {CareerDetail, CareerSummary} from "@/domain/entities/career";
import {careerDetailSchema, careerSummariesSchema} from "@/infrastructure/api/schemas/career";

type RelationRow = {id: string; name: string} | null;

/** Relasi `{id,name}` → nama saja; relasi kosong → string kosong (D2). */
function relationName(relation: RelationRow): string {
  return relation?.name ?? "";
}

export function toCareerSummaries(raw: unknown): CareerSummary[] {
  return careerSummariesSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      positionTitle: row.positionTitle,
      employmentType: relationName(row.employmentType),
      department: relationName(row.department),
      location: row.location,
    }));
}

/** `null` dari API → `undefined` di entity, supaya prop opsional React rapi. */
export function toCareerDetail(raw: unknown): CareerDetail {
  const row = careerDetailSchema.parse(raw);
  return {
    id: row.id,
    slug: row.slug,
    positionTitle: row.positionTitle,
    employmentType: relationName(row.employmentType),
    department: relationName(row.department),
    location: row.location,
    roleDescription: row.roleDescription,
    requirements: row.requirements,
    benefits: row.benefits ?? undefined,
  };
}
