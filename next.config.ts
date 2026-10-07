import type { NextConfig } from "next";

const wpUrl = new URL(process.env.WP_URL ?? "http://localhost/ili");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Mesmo formato de URL do WordPress (/servicos/, /case/slug/) para não perder SEO.
  trailingSlash: true,
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
