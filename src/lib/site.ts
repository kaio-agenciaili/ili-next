/**
 * Indexação no Google só é liberada com ALLOW_INDEXING=true (no lançamento, no domínio oficial).
 * Sem a variável, todas as páginas respondem noindex para não duplicar o site no ar.
 */
export const allowIndexing = process.env.ALLOW_INDEXING === "true";

export const site = {
  name: "Agencia ili",
  /** Endereço público do site (links de compartilhamento dos posts). */
  url: "https://agenciaili.com.br",
  email: "contato@agenciaili.com.br",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  whatsapp:
    "https://tintim.link/whatsapp/6aa72eca-931f-4bd1-bdcc-1ec8d2c2d30d/2b52e8e4-eabe-408f-9e5b-f3b6c0bda627",
};

/** IDs dos formulários do Contact Form 7 no WordPress. */
export const cf7Forms = {
  contato: { formId: 295, pageSlug: "contato" },
  diagnostico: { formId: 296, pageSlug: "diagnostico" },
} as const;

/** URLs com barra final, no mesmo formato do WordPress. */
export const routes = {
  home: "/",
  quemSomos: "/quem-somos/",
  servicos: "/servicos/",
  contato: "/contato/",
  diagnostico: "/diagnostico/",
  cases: "/cases/",
  politicaPrivacidade: "/politica-de-privacidade/",
  blog: "/blog/",
  /** Single do CPT `ili_case` (slug `/case/{slug}/`). */
  caso: (slug: string) => `/case/${slug}/`,
  /** Posts ficam na raiz, como no WordPress (`/%postname%/`). */
  post: (slug: string) => `/${slug}/`,
  categoria: (slug: string, page = 1) => (page > 1 ? `/category/${slug}/page/${page}/` : `/category/${slug}/`),
  metodo: "/#metodo",
  /** Single do CPT `ili_servicos` (slug `/servico/{slug}/`). */
  servico: (slug: string) => {
    const s = slug.trim();
    return s ? `/servico/${encodeURIComponent(s)}/` : "/servicos/";
  },
};
