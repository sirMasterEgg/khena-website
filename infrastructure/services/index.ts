import type {ContactSubmissionService} from "@/domain/services/contact-submission-service";
import type {LeadService} from "@/domain/services/lead-service";
import type {JobApplicationService} from "@/domain/services/job-application-service";
import {MockContactSubmissionService} from "@/infrastructure/mock/services/mock-contact-submission-service";
import {MockLeadService} from "@/infrastructure/mock/services/mock-lead-service";
import {MockJobApplicationService} from "@/infrastructure/mock/services/mock-job-application-service";

// Satu titik pemilihan implementasi aktif — sama seperti
// infrastructure/repositories/index.ts (bagian 2.2 issue.md).
export const contactSubmissionService: ContactSubmissionService = new MockContactSubmissionService();
// nanti -> new HttpContactSubmissionService(apiClient);

export const leadService: LeadService = new MockLeadService();
// nanti -> new HttpLeadService(apiClient);

export const jobApplicationService: JobApplicationService = new MockJobApplicationService();
// nanti -> new HttpJobApplicationService(apiClient);
