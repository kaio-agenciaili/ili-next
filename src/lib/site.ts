export const site = {
  name: "Agencia ili",
  email: "contato@agenciaili.com.br",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  whatsapp:
    "https://tintim.link/whatsapp/6aa72eca-931f-4bd1-bdcc-1ec8d2c2d30d/2b52e8e4-eabe-408f-9e5b-f3b6c0bda627",
};

/** URLs com barra final, no mesmo formato do WordPress. */
export const routes = {
  home: "/",
  quemSomos: "/quem-somos/",
  servicos: "/servicos/",
  contato: "/contato/",
  diagnostico: "/diagnostico/",
  cases: "/cases/",
  metodo: "/#metodo",
  /** Single do CPT `ili_servicos` (slug `/servico/{slug}/`). */
  servico: (slug: string) => {
    const s = slug.trim();
    return s ? `/servico/${encodeURIComponent(s)}/` : "/servicos/";
  },
};
