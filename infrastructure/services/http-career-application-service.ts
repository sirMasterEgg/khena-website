import type {
  CareerApplication,
  CareerApplicationService,
} from "@/domain/services/career-application-service";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {apiClient} from "@/infrastructure/api/client";

/** `POST /api/careers/apply` — multipart, tanpa auth & tanpa CSRF (Bagian 37). */
export class HttpCareerApplicationService implements CareerApplicationService {
  async submit(application: CareerApplication): Promise<void> {
    const form = new FormData();
    // Hanya di-append kalau ada — lamaran spontan sah tanpa jobId (D7).
    if (application.jobId) form.append("jobId", application.jobId);
    form.append("name", application.name);
    form.append("email", application.email);
    form.append("phone", application.phone);
    if (application.message) form.append("message", application.message);
    if (application.attachment) form.append("attachment", application.attachment);

    await apiClient.post(API_ENDPOINTS.careers.apply, form, {
      // WAJIB. `apiClient` punya default "Content-Type: application/json";
      // selama header itu masih terpasang, axios mengubah FormData jadi JSON
      // (transformRequest) dan file-nya HILANG — backend membalas 422.
      // Dengan undefined, browser sendiri yang mengisi
      // "multipart/form-data; boundary=...".
      headers: {"Content-Type": undefined},
    });
  }
}
