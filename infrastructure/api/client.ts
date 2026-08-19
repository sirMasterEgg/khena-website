import axios, {AxiosError, type AxiosInstance} from "axios";
import {clientEnv} from "@/config/env.client";

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
      new Error(`API error${status ? ` ${status}` : ""}: ${message}`)
    );
  }
);
