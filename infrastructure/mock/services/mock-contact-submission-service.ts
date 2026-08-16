import type {
  ContactSubmission,
  ContactSubmissionResult,
  ContactSubmissionService,
} from "@/domain/services/contact-submission-service";

const submissions: ContactSubmission[] = [];

/**
 * Implementasi mock — mencatat submission di memori, bukan sekadar toast
 * seperti di prototipe (bagian 6.3 issue.md). Penyambungan ke backend nyata
 * (simpan + email notifikasi) adalah bagian ISSUE-15.
 */
export class MockContactSubmissionService implements ContactSubmissionService {
  async submit(input: ContactSubmission): Promise<ContactSubmissionResult> {
    submissions.push(input);
    return {id: `contact-${submissions.length}`};
  }
}
