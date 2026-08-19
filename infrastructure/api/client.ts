import axios, {AxiosError, type AxiosInstance} from "axios";
import {clientEnv} from "@/config/env.client";

/**
 * Error terstruktur dari `apiClient` — supaya pemanggil bisa membedakan 401
 * (sesi habis/tidak ada) dari error lain lewat `isUnauthorized`, tanpa
 * parsing pesan string (bagian Fase 9 issue.md).
 *
 * Sengaja TIDAK ada auto-redirect global di sini (mis. langsung membuka
 * drawer sign in) — itu akan mengagetkan user yang sedang mengisi form.
 * Pemanggil yang memutuskan sendiri mau menampilkan ajakan sign in seperti
 * apa lewat flag ini.
 */
export class ApiError extends Error {
  readonly status?: number;
  readonly isUnauthorized: boolean;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isUnauthorized = status === 401;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
  // Endpoint bisnis yang butuh sesi user mengandalkan cookie sesi dari
  // better-auth — tanpa ini request lintas origin dianggap tamu.
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? error.message ?? "Unknown API error";
    return Promise.reject(
      new ApiError(`API error${status ? ` ${status}` : ""}: ${message}`, status)
    );
  }
);
