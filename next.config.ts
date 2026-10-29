import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las secciones de agencias pasaron a llamarse "concesionarias".
  async redirects() {
    return [
      { source: "/agencias", destination: "/concesionarias", permanent: true },
      { source: "/para-agencias", destination: "/para-concesionarias", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
