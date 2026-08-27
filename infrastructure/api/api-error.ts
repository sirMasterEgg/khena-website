/**
 * Error terstruktur untuk transport Server Component (`serverFetch`) — bagian
 * Fase 1 issue #27. Membawa `status` HTTP dan `code` mesin-terbaca dari
 * envelope error backend (`{error: {code, message}}`, contract.md bagian 1)
 * supaya pemanggil bisa membedakan penyebab tanpa parsing pesan string.
 */
export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}
