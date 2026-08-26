import "server-only";
import {clientEnv} from "@/config/env.client";
import {ApiRequestError} from "@/infrastructure/api/api-error";

export type ServerFetchOptions = {
  /** Query string; nilai `undefined` otomatis dibuang. */
  query?: Record<string, string | number | undefined>;
  /** Detik. Default 300 (5 menit) — konten CMS tidak perlu real-time. */
  revalidateSeconds?: number;
  /** Tag untuk `revalidateTag` di masa depan. */
  tags?: string[];
};

const DEFAULT_REVALIDATE_SECONDS = 300;

function buildUrl(path: string, query?: ServerFetchOptions["query"]): string {
  const url = new URL(`${clientEnv.NEXT_PUBLIC_API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

type ErrorEnvelope = {error?: {code?: string; message?: string}};

/**
 * Transport `fetch` untuk Server Component — dipakai konten CMS publik
 * (bukan endpoint bersesi, itu tetap lewat `apiClient` axios di client.ts).
 * Membuka envelope `{data: ...}` di sini, satu kali, supaya lapisan di atas
 * (repository, use case) tidak perlu tahu soal envelope — bagian Fase 1
 * issue #27.
 */
export async function serverFetch<T>(path: string, options?: ServerFetchOptions): Promise<T> {
  const url = buildUrl(path, options?.query);
  const revalidate = options?.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS;

  const res = await fetch(url, {
    headers: {Accept: "application/json"},
    next: {revalidate, tags: options?.tags},
  });

  if (!res.ok) {
    let code = "UNKNOWN_ERROR";
    let message = res.statusText;
    try {
      const body = (await res.json()) as ErrorEnvelope;
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // Body bukan JSON — pertahankan res.statusText.
    }
    throw new ApiRequestError(message, res.status, code);
  }

  const json = (await res.json()) as {data: T};
  return json.data;
}
