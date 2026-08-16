import type {ContactSubmissionService} from "@/domain/services/contact-submission-service";
import {MockContactSubmissionService} from "@/infrastructure/mock/services/mock-contact-submission-service";

// Satu titik pemilihan implementasi aktif — sama seperti
// infrastructure/repositories/index.ts (bagian 2.2 issue.md).
export const contactSubmissionService: ContactSubmissionService = new MockContactSubmissionService();
// nanti -> new HttpContactSubmissionService(apiClient);
