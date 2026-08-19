/**
 * Pemetaan kode error better-auth → kalimat untuk ditampilkan ke user.
 *
 * Backend sengaja memberi pesan generic saat login gagal (tidak membedakan
 * "email tidak ada" vs "password salah") — pertahankan, jangan diperjelas,
 * supaya tidak membocorkan email mana yang terdaftar.
 */

/** Dipakai kalau kode error tidak dikenal. */
const FALLBACK = "Something went wrong. Please try again.";

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid login — check your email and password and try again.",
  USER_ALREADY_EXISTS: "An account with this email already exists.",
  EMAIL_NOT_VERIFIED: "Email not confirmed — check your inbox for the verification link.",
  INVALID_TOKEN: "This reset link is invalid or has expired. Request a new one.",
};

export function authErrorMessage(error?: {code?: string; message?: string} | null): string {
  if (!error) return FALLBACK;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  // Pesan dari hook validasi backend (mis. "phone already exists") sudah layak
  // ditampilkan apa adanya.
  return error.message ?? FALLBACK;
}
