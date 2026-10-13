import { cacheLife, cacheTag } from "next/cache";
import { decodeEntities, keepOnlyLineBreaks, stripTags, trimWords } from "@/lib/html";

/**
 * Acesso ao WordPress headless (REST API + ACF).
 * Todo o resto do app consome só as funções/tipos exportados daqui,
 * então trocar de CMS no futuro mexe apenas nesta pasta.
 */

const WP_URL = (process.env.WP_URL ?? "http://localhost/ili").replace(/\/$/, "");

/* ------------------------------------------------------------------ */
/* Tipos crus da REST                                                  */
/* ------------------------------------------------------------------ */

type WpMedia = {
  url: string;
  width: number;
  height: number;
  alt: string;
  mime_type?: string;
  type?: string;
} | false | null;

type WpRendered = { rendered: string };

type WpFeatured = { source_url: string; media_details?: { width: number; height: number } };

type WpPostBase = {
  id: number;
  slug: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  /** Só existe com o mu-plugin `ili-headless.php`. */
  excerpt_raw?: string;
  /** Só existe com o mu-plugin `ili-headless.php`. */
  menu_order?: number;
  yoast_head_json?: { title?: string; description?: string };
  _embedded?: { "wp:featuredmedia"?: WpFeatured[] };
};

type WpRepeater<T> = T[] | false | null | undefined;

type WpCase = WpPostBase & {
  acf: {
    banner?: WpMedia;
    lista_resultados?: WpRepeater<{ numero?: string; descricao?: string }>;
    tags?: WpRepeater<{ tag?: string }>;
    texto_depoimento?: string;
    nome?: string;
    cargo?: string;
    empresa?: string;
    foto?: WpMedia;
  };
};

type WpRelation = WpRepeater<{ ID: number } | number>;

type WpService = WpPostBase & {
  acf: {
    banner?: WpMedia;
    tags?: WpRepeater<{ tag?: string }>;
    titulo_descricao?: string;
    lista_do_servico?: WpRepeater<{ titulo?: string; descricao?: string }>;
    case_relacionado?: WpRelation;
    servico_relacionado?: WpRelation;
    texto_relacionados?: string;
    titulo_cta?: string;
    subtitulo_cta?: string;
  };
};

/* ------------------------------------------------------------------ */
/* Tipos usados pelas páginas                                          */
/* ------------------------------------------------------------------ */

export type CmsImage = { url: string; width: number; height: number; alt: string };

export type CmsMedia = (CmsImage & { kind: "image" }) | { kind: "video"; url: string; mime: string };

export type Seo = { title?: string; description?: string };

/** Case no formato do carrossel (Home e páginas de serviço). */
export type CaseSlide = {
  id: number;
  slug: string;
  title: string;
  banner: CmsImage | null;
  /** Até 3 resultados (número + descrição). */
  stats: { numero: string; descricao: string }[];
  /** Até 3 tags — só preenchidas quando não há resultados. */
  tags: string[];
  testimonial: {
    /** HTML vindo do CMS (o tema usava `wp_kses_post`). */
    html: string;
    name: string;
    role: string;
    company: string;
    photo: CmsImage | null;
  } | null;
  /** Resumo usado no balão quando não há depoimento. */
  summary: string;
};

export type Service = {
  id: number;
  slug: string;
  title: string;
  /** Resumo dos cards (resumo manual ou 40 palavras do conteúdo). */
  summary: string;
  tags: string[];
  /** HTML do editor (`the_content`). */
  contentHtml: string;
  banner: CmsMedia | null;
  /** Título da coluna esquerda; só `<br>` é permitido. */
  introHtml: string;
  items: { title: string; descHtml: string }[];
  caseIds: number[];
  relatedIds: number[];
  relatedText: string;
  /** HTML do CMS; vazio = usa o texto padrão do tema. */
  ctaTitleHtml: string;
  ctaSubtitleHtml: string;
  seo: Seo;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function wpFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams(params).toString();
  const url = `${WP_URL}/wp-json/wp/v2/${path}${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WordPress respondeu ${res.status} em ${url}`);
  }
  return res.json() as Promise<T>;
}

function toImage(img: WpMedia | undefined, fallbackAlt: string): CmsImage | null {
  if (!img || !img.url) return null;
  return { url: img.url, width: img.width, height: img.height, alt: img.alt || fallbackAlt };
}

function featuredImage(post: WpPostBase, alt: string): CmsImage | null {
  const featured = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!featured) return null;
  return {
    url: featured.source_url,
    width: featured.media_details?.width ?? 1920,
    height: featured.media_details?.height ?? 1080,
    alt,
  };
}

function clean(value: unknown): string {
  return typeof value === "string" ? stripTags(value) : "";
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function rows<T>(value: WpRepeater<T>): T[] {
  return Array.isArray(value) ? value : [];
}

function relationIds(value: WpRelation): number[] {
  return rows(value)
    .map((item) => (typeof item === "number" ? item : item?.ID))
    .filter((id): id is number => typeof id === "number" && id > 0);
}

function tagsOf(value: WpRepeater<{ tag?: string }>): string[] {
  return rows(value).map((row) => clean(row?.tag)).filter(Boolean);
}

/**
 * Resumo manual do post; vazio quando não há.
 * Sem o mu-plugin, deduz pelo `excerpt` da REST (o automático termina em "[…]").
 */
function manualExcerpt(post: WpPostBase): string {
  if (typeof post.excerpt_raw === "string") return post.excerpt_raw.trim();
  return post.excerpt.rendered.includes("[&hellip;]") ? "" : stripTags(post.excerpt.rendered);
}

function seoOf(post: { yoast_head_json?: { title?: string; description?: string } }): Seo {
  return { title: post.yoast_head_json?.title, description: post.yoast_head_json?.description };
}

/* ------------------------------------------------------------------ */
/* Cases                                                               */
/* ------------------------------------------------------------------ */

function toCaseSlide(post: WpCase): CaseSlide {
  const acf = post.acf ?? {};
  const title = decodeEntities(post.title.rendered);

  const stats = rows(acf.lista_resultados)
    .map((row) => ({ numero: clean(row?.numero), descricao: clean(row?.descricao) }))
    .filter((row) => row.numero !== "" || row.descricao !== "")
    .slice(0, 3);

  const quoteHtml = text(acf.texto_depoimento);
  const name = text(acf.nome);
  const role = text(acf.cargo);
  const company = text(acf.empresa);
  const photo = toImage(acf.foto, name || title);
  const hasTestimonial = stripTags(quoteHtml) !== "" || name !== "" || role !== "" || company !== "" || photo !== null;

  let summary = manualExcerpt(post);
  if (summary === "") summary = stripTags(post.content.rendered);
  if (summary !== "") summary = trimWords(summary, 48);

  return {
    id: post.id,
    slug: post.slug,
    title,
    banner: toImage(acf.banner, title) ?? featuredImage(post, title),
    stats,
    tags: stats.length > 0 ? [] : tagsOf(acf.tags).slice(0, 3),
    testimonial: hasTestimonial
      ? { html: stripTags(quoteHtml) !== "" ? quoteHtml : "", name, role, company, photo }
      : null,
    summary,
  };
}

const CASE_PARAMS = { acf_format: "standard", _embed: "wp:featuredmedia" };

/** Cases do carrossel da Home (mesma regra do `home.php`). */
export async function getHomeCases(): Promise<CaseSlide[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cases");

  const posts = await wpFetch<WpCase[]>("ili_case", { ...CASE_PARAMS, per_page: "8", orderby: "date", order: "asc" });
  return posts.map(toCaseSlide);
}

/** Cases publicados com esses IDs, na mesma ordem pedida. */
export async function getCasesByIds(ids: number[]): Promise<CaseSlide[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cases");

  if (ids.length === 0) return [];
  const posts = await wpFetch<WpCase[]>("ili_case", {
    ...CASE_PARAMS,
    include: ids.join(","),
    orderby: "include",
    per_page: String(ids.length),
  });
  return posts.map(toCaseSlide);
}

/* ------------------------------------------------------------------ */
/* Serviços                                                            */
/* ------------------------------------------------------------------ */

function toService(post: WpService): Service {
  const acf = post.acf ?? {};
  const title = decodeEntities(post.title.rendered);

  let banner: CmsMedia | null = null;
  if (acf.banner && acf.banner.url) {
    const mime = acf.banner.mime_type ?? "";
    const isVideo = mime.toLowerCase().startsWith("video/") || acf.banner.type?.toLowerCase() === "video";
    banner = isVideo
      ? { kind: "video", url: acf.banner.url, mime }
      : { kind: "image", ...toImage(acf.banner, "")! };
  } else {
    const featured = featuredImage(post, "");
    if (featured) banner = { kind: "image", ...featured };
  }

  const excerpt = manualExcerpt(post);

  return {
    id: post.id,
    slug: post.slug,
    title,
    summary: excerpt !== "" ? excerpt : trimWords(stripTags(post.content.rendered), 40),
    tags: tagsOf(acf.tags),
    contentHtml: post.content.rendered.trim(),
    banner,
    introHtml: keepOnlyLineBreaks(text(acf.titulo_descricao)),
    items: rows(acf.lista_do_servico)
      .map((row) => ({ title: text(row?.titulo), descHtml: text(row?.descricao) }))
      .filter((row) => row.title !== "" || row.descHtml !== ""),
    caseIds: relationIds(acf.case_relacionado),
    relatedIds: relationIds(acf.servico_relacionado).filter((id) => id !== post.id),
    relatedText: text(acf.texto_relacionados),
    ctaTitleHtml: text(acf.titulo_cta),
    ctaSubtitleHtml: text(acf.subtitulo_cta),
    seo: seoOf(post),
  };
}

/** Todos os serviços publicados, na ordem do painel (ordem → título), como no `servicos.php`. */
export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  const posts = await wpFetch<WpService[]>("ili_servicos", {
    acf_format: "standard",
    _embed: "wp:featuredmedia",
    per_page: "100",
  });

  return posts
    .sort(
      (a, b) =>
        (a.menu_order ?? 0) - (b.menu_order ?? 0) ||
        decodeEntities(a.title.rendered).localeCompare(decodeEntities(b.title.rendered), "pt-BR", { sensitivity: "base" }),
    )
    .map(toService);
}

export async function getService(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ */
/* Páginas                                                             */
/* ------------------------------------------------------------------ */

/** SEO (Yoast) de uma página do WordPress pelo slug. */
export async function getPageSeo(slug: string): Promise<Seo> {
  "use cache";
  cacheLife("hours");
  cacheTag("pages");

  const pages = await wpFetch<WpPostBase[]>("pages", { slug, _fields: "yoast_head_json" });
  return pages[0] ? seoOf(pages[0]) : {};
}
