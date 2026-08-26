import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Object storage backend (MinIO) untuk dev lokal — bagian 0.3 issue #27.
      // Kalau staging/produksi memakai host lain, tambahkan pattern terpisah
      // di sini (jangan ganti yang lokal ini).
      {protocol: "http", hostname: "localhost", port: "9000", pathname: "/**"},
    ],
  },
};

export default nextConfig;
