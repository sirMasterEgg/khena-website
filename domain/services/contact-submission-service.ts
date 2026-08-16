export type ContactSubmission = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachmentName?: string;
};

export type ContactSubmissionResult = {
  id: string;
};

/**
 * Abstraksi pengiriman form kontak — bagian 4.8 & 6.3 issue.md. Implementasi
 * mock (ISSUE-12) mencatat submission; penyambungan ke backend nyata adalah
 * bagian ISSUE-15.
 */
export interface ContactSubmissionService {
  submit(input: ContactSubmission): Promise<ContactSubmissionResult>;
}
