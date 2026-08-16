import type {Job} from "@/domain/entities/job";
import type {JobRepository} from "@/domain/repositories/job-repository";
import {MOCK_JOBS} from "@/infrastructure/mock/data/jobs";

export class MockJobRepository implements JobRepository {
  async getAll(): Promise<Job[]> {
    return MOCK_JOBS;
  }
}
