import {isJobOpen, type Job} from "@/domain/entities/job";
import {jobRepository} from "@/infrastructure/repositories";

export async function getOpenJobs(): Promise<Job[]> {
  const jobs = await jobRepository.getAll();
  return jobs.filter(isJobOpen);
}
