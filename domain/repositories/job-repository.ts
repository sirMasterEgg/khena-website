import type {Job} from "@/domain/entities/job";

export interface JobRepository {
  getAll(): Promise<Job[]>;
}
