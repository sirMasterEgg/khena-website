import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Object storage backend (MinIO) untuk dev lokal — bagian 0.3 issue #27.
      // Kalau staging/produksi memakai host lain, tambahkan pattern terpisah
      // di sini (jangan ganti yang lokal ini).
      {protocol: "http", hostname: "localhost", port: "9000", pathname: "/**"},
    ],
    // Next 16 menolak mengoptimasi gambar yang resolve ke IP privat/loopback
    // secara default (proteksi SSRF, config `dangerouslyAllowLocalIP` baru di
    // v16.0.0 — tidak disebut di issue.md karena dokumen ditulis sebelum
    // config ini ada). Tanpa ini, `localhost:9000` MinIO di atas gagal total
    // dengan error "resolved to private ip". remotePatterns di atas sudah
    // membatasi host yang diizinkan, jadi ini aman untuk dev lokal.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
