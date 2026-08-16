import type {
  JobApplication,
  JobApplicationResult,
  JobApplicationService,
} from "@/domain/services/job-application-service";

const applications: JobApplication[] = [];

export class MockJobApplicationService implements JobApplicationService {
  async submit(application: JobApplication): Promise<JobApplicationResult> {
    applications.push(application);
    return {id: `application-${applications.length}`};
  }
}
