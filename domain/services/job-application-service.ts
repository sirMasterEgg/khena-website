export type JobApplication = {
  jobId?: string;
  fullName: string;
  email: string;
  phone: string;
  coverNote?: string;
  resumeFileName?: string;
};

export type JobApplicationResult = {
  id: string;
};

/** Abstraksi pengiriman lamaran kerja — bagian 4.9 issue.md (halaman /info/career). */
export interface JobApplicationService {
  submit(application: JobApplication): Promise<JobApplicationResult>;
}
