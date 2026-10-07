import type { NextConfig } from "next";

const wpUrl = new URL(process.env.WP_URL ?? "http://localhost/ili");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Mesmo formato de URL do WordPress (/servicos/, /case/slug/) para não perder SEO.
  trailingSlash: true,
  // Enquanto o site novo não substitui o oficial, nada deve ser indexado (evita conteúdo duplicado).
  // Vale para tudo, inclusive imagens e arquivos; liberar com ALLOW_INDEXING=true no lançamento.
  async headers() {
    if (process.env.ALLOW_INDEXING === "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  images: {
    remotePatterns: [
      {
        protocol: wpUrl.protocol === "https:" ? "https" : "http",
        hostname: wpUrl.hostname,
        port: wpUrl.port,
        pathname: `${wpUrl.pathname.replace(/\/$/, "")}/wp-content/uploads/**`,
      },
    ],
    // Em dev o WordPress roda no XAMPP (localhost), que o otimizador bloqueia por padrão.
    dangerouslyAllowLocalIP: wpUrl.hostname === "localhost",
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
