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
    titulo?: string;
    banner?: WpMedia;
    lista_resultados?: WpRepeater<{ numero?: string; descricao?: string }>;
    tags?: WpRepeater<{ tag?: string }>;
    banner_desafio?: WpMedia;
    titulo_desafio?: string;
    texto_desafio?: string;
    two_img?: WpRepeater<{ imagem?: WpMedia }>;
    titulo_resolver?: string;
    texto_resolver?: string;
    full_imagem?: WpMedia;
    titulo_estrategia?: string;
    texto_estrategia?: string;
    titulo_depoimento?: string;
    texto_depoimento?: string;
    nome?: string;
    cargo?: string;
    empresa?: string;
    foto?: WpMedia;
    imagens_solucoes?: WpRepeater<{ imagem?: WpMedia }>;
    titulo_solucoes?: string;
    texto_solucoes?: string;
    titulo_resultados?: string;
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

/** Case no formato dos cards (listagem /cases/ e “veja outros cases”). */
export type CaseCard = {
  id: number;
  slug: string;
  title: string;
  banner: CmsImage | null;
  tags: string[];
  /** Até 3 resultados. */
  stats: { numero: string; descricao: string }[];
  /** Resumo manual (sem tags) ou "" quando não há. */
  manualExcerpt: string;
  /** Texto do conteúdo, sem tags. */
  contentText: string;
};

/** Bloco de texto das seções do case: título (HTML) + texto do editor (HTML). Vazio = não aparece. */
export type CaseTextBlock = { titleHtml: string; textHtml: string };

export type CaseDetail = CaseCard & {
  hero: { titleHtml: string; bannerUrl: string };
  challenge: { image: CmsImage | null } & CaseTextBlock;
  solve: { images: CmsImage[] } & CaseTextBlock;
  strategy: { image: CmsImage | null } & CaseTextBlock;
  testimonial: {
    titleHtml: string;
    textHtml: string;
    name: string;
    role: string;
    company: string;
    photo: CmsImage | null;
  };
  solutions: { images: CmsImage[] } & CaseTextBlock;
  results: { titleHtml: string; items: { numeroHtml: string; descricao: string }[] };
  seo: Seo;
};

/** Considera vazio um HTML que não tem texto (como o `trim(wp_strip_all_tags())` do tema). */
function htmlOrEmpty(value: unknown): string {
  const html = text(value);
  return stripTags(html) === "" ? "" : html;
}

function rowImages(value: WpRepeater<{ imagem?: WpMedia }>): CmsImage[] {
  return rows(value)
    .map((row) => toImage(row?.imagem, ""))
    .filter((img): img is CmsImage => img !== null);
}

function toCaseCard(post: WpCase): CaseCard {
  const acf = post.acf ?? {};
  const title = decodeEntities(post.title.rendered);
  return {
    id: post.id,
    slug: post.slug,
    title,
    banner: toImage(acf.banner, title) ?? featuredImage(post, title),
    tags: tagsOf(acf.tags),
    stats: rows(acf.lista_resultados)
      .map((row) => ({ numero: clean(row?.numero), descricao: clean(row?.descricao) }))
      .filter((row) => row.numero !== "" || row.descricao !== "")
      .slice(0, 3),
    manualExcerpt: stripTags(manualExcerpt(post)),
    contentText: stripTags(post.content.rendered),
  };
}

function toCaseDetail(post: WpCase): CaseDetail {
  const acf = post.acf ?? {};
  const card = toCaseCard(post);
  return {
    ...card,
    hero: { titleHtml: htmlOrEmpty(acf.titulo), bannerUrl: acf.banner ? acf.banner.url : "" },
    challenge: {
      image: toImage(acf.banner_desafio, ""),
      titleHtml: htmlOrEmpty(acf.titulo_desafio),
      textHtml: htmlOrEmpty(acf.texto_desafio),
    },
    solve: {
      images: rowImages(acf.two_img),
      titleHtml: htmlOrEmpty(acf.titulo_resolver),
      textHtml: htmlOrEmpty(acf.texto_resolver),
    },
    strategy: {
      image: toImage(acf.full_imagem, ""),
      titleHtml: htmlOrEmpty(acf.titulo_estrategia),
      textHtml: htmlOrEmpty(acf.texto_estrategia),
    },
    testimonial: {
      titleHtml: htmlOrEmpty(acf.titulo_depoimento),
      textHtml: htmlOrEmpty(acf.texto_depoimento),
      name: clean(acf.nome),
      role: clean(acf.cargo),
      company: clean(acf.empresa),
      photo: toImage(acf.foto, clean(acf.nome)),
    },
    solutions: {
      images: rowImages(acf.imagens_solucoes),
      titleHtml: htmlOrEmpty(acf.titulo_solucoes),
      textHtml: htmlOrEmpty(acf.texto_solucoes),
    },
    results: {
      titleHtml: htmlOrEmpty(acf.titulo_resultados),
      // Na página interna o tema mostra todos os resultados (nos cards, só 3).
      items: rows(acf.lista_resultados)
        .map((row) => ({ numeroHtml: text(row?.numero), descricao: clean(row?.descricao) }))
        .filter((row) => row.numeroHtml !== "" || row.descricao !== ""),
    },
    seo: seoOf(post),
  };
}

/** Todos os cases publicados, do mais recente para o mais antigo. */
async function getAllCases(): Promise<WpCase[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cases");

  return wpFetch<WpCase[]>("ili_case", { ...CASE_PARAMS, per_page: "100", orderby: "date", order: "desc" });
}

export async function getCaseCards(): Promise<CaseCard[]> {
  return (await getAllCases()).map(toCaseCard);
}

export async function getCase(slug: string): Promise<CaseDetail | null> {
  const post = (await getAllCases()).find((p) => p.slug === slug);
  return post ? toCaseDetail(post) : null;
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
/* Blog                                                                */
/* ------------------------------------------------------------------ */

type WpTerm = { id: number; slug: string; name: string; taxonomy: string };

type WpPost = WpPostBase & {
  date: string;
  categories: number[];
  _embedded?: WpPostBase["_embedded"] & {
    author?: { name: string; description: string; avatar_urls?: Record<string, string> }[];
    "wp:term"?: WpTerm[][];
  };
};

export type BlogCategory = { id: number; slug: string; name: string; description: string; seo: Seo };

export type PostCard = {
  id: number;
  slug: string;
  title: string;
  /** Texto do `get_the_excerpt` (resumo manual ou o automático do WP). */
  excerpt: string;
  /** Data já no formato do WordPress ("13 de outubro de 2026"). */
  date: string;
  /** Tempo de leitura em minutos (mesma conta do tema). */
  minutes: number;
  /** Primeira categoria do post (`get_the_category()[0]`). */
  category: { slug: string; name: string } | null;
  image: CmsImage | null;
};

export type PostDetail = PostCard & {
  contentHtml: string;
  categoryIds: number[];
  author: { name: string; bio: string; avatar: string | null };
  seo: Seo;
};

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Formato de data do WordPress (`j \d\e F \d\e Y`) a partir da data local do post. */
function formatWpDate(date: string): string {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

/** Mesma conta do tema: `str_word_count` do PHP (só letras ASCII contam como palavra) ÷ 200. */
function readingMinutes(html: string): number {
  const words = stripTags(html).match(/[A-Za-z'-]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(Math.max(1, words) / 200));
}

function toPostCard(post: WpPost): PostCard {
  const title = decodeEntities(post.title.rendered);
  const term = post._embedded?.["wp:term"]?.flat().find((t) => t.taxonomy === "category");
  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: stripTags(post.excerpt.rendered),
    date: formatWpDate(post.date),
    minutes: readingMinutes(post.content.rendered),
    category: term ? { slug: term.slug, name: decodeEntities(term.name) } : null,
    image: featuredImage(post, title),
  };
}

function toPostDetail(post: WpPost): PostDetail {
  const author = post._embedded?.author?.[0];
  const avatar = author?.avatar_urls?.["96"]?.replace(/([?&])s=\d+/, "$1s=160") ?? null;
  return {
    ...toPostCard(post),
    contentHtml: post.content.rendered,
    categoryIds: post.categories ?? [],
    author: { name: author?.name ?? "", bio: author?.description ?? "", avatar },
    seo: seoOf(post),
  };
}

const POST_PARAMS = { _embed: "author,wp:featuredmedia,wp:term" };

type PostQuery = { perPage?: number; page?: number; categories?: number[]; exclude?: number[] };

/** Posts publicados, do mais recente para o mais antigo, com o total de páginas. */
async function queryPosts({ perPage = 10, page = 1, categories, exclude }: PostQuery) {
  const params: Record<string, string> = { ...POST_PARAMS, per_page: String(perPage), page: String(page) };
  if (categories?.length) params.categories = categories.join(",");
  if (exclude?.length) params.exclude = exclude.join(",");

  const url = `${WP_URL}/wp-json/wp/v2/posts?${new URLSearchParams(params)}`;
  const res = await fetch(url);
  // Página além da última: a REST responde 400 (rest_post_invalid_page_number).
  if (res.status === 400) return { posts: [] as WpPost[], totalPages: 0 };
  if (!res.ok) throw new Error(`WordPress respondeu ${res.status} em ${url}`);
  return { posts: (await res.json()) as WpPost[], totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1) };
}

export async function getCategories(): Promise<BlogCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const terms = await wpFetch<(Omit<BlogCategory, "seo"> & { yoast_head_json?: Seo })[]>("categories", {
    per_page: "100",
    _fields: "id,slug,name,description,yoast_head_json",
  });
  return terms.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: decodeEntities(t.name),
    description: stripTags(t.description),
    seo: seoOf(t),
  }));
}

export async function getCategory(slug: string): Promise<BlogCategory | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getLatestPosts(count: number, exclude: number[] = []): Promise<PostCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const { posts } = await queryPosts({ perPage: count, exclude });
  return posts.map(toPostCard);
}

export async function getCategoryPosts(categoryId: number, count: number, exclude: number[] = []): Promise<PostCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const { posts } = await queryPosts({ perPage: count, categories: [categoryId], exclude });
  return posts.map(toPostCard);
}

/** “continue lendo”: 3 posts mais recentes das mesmas categorias, sem o atual. */
export async function getRelatedPosts(post: PostDetail): Promise<PostCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const { posts } = await queryPosts({ perPage: 3, categories: post.categoryIds, exclude: [post.id] });
  return posts.map(toPostCard);
}

/** Arquivo da categoria, paginado como no WordPress (10 por página). */
export async function getCategoryArchive(categoryId: number, page: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const { posts, totalPages } = await queryPosts({ perPage: 10, page, categories: [categoryId] });
  return { posts: posts.map(toPostCard), totalPages };
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const posts = await wpFetch<WpPost[]>("posts", { ...POST_PARAMS, slug });
  return posts[0] ? toPostDetail(posts[0]) : null;
}

/** Slugs de todos os posts publicados (para gerar as páginas no build). */
export async function getPostSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const slugs: string[] = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug`);
    if (!res.ok) break;
    const batch = (await res.json()) as { slug: string }[];
    slugs.push(...batch.map((p) => p.slug));
    if (page >= Number(res.headers.get("X-WP-TotalPages") ?? 1)) break;
  }
  return slugs;
}

/* ------------------------------------------------------------------ */
/* Páginas                                                             */
/* ------------------------------------------------------------------ */

/** ID de uma página do WordPress pelo slug. */
async function getPageId(slug: string): Promise<number | null> {
  "use cache";
  cacheLife("days");
  cacheTag("pages");

  const pages = await wpFetch<{ id: number }[]>("pages", { slug, _fields: "id" });
  return pages[0]?.id ?? null;
}

/** Dados que o navegador precisa para enviar um formulário direto ao Contact Form 7. */
export type Cf7Config = {
  endpoint: string;
  formId: number;
  unitTag: string;
  containerPost: number;
};

/**
 * O envio sai do navegador do visitante direto para a REST do CF7 (como no tema),
 * para o Flamingo continuar registrando IP e navegador reais do lead.
 */
export async function getCf7Config(formId: number, pageSlug: string): Promise<Cf7Config> {
  const pageId = (await getPageId(pageSlug)) ?? 1;
  return {
    endpoint: `${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
    formId,
    unitTag: `wpcf7-f${formId}-p${pageId}-o1`,
    containerPost: pageId,
  };
}

/** SEO (Yoast) de uma página do WordPress pelo slug. */
export async function getPageSeo(slug: string): Promise<Seo> {
  "use cache";
  cacheLife("hours");
  cacheTag("pages");

  const pages = await wpFetch<WpPostBase[]>("pages", { slug, _fields: "yoast_head_json" });
  return pages[0] ? seoOf(pages[0]) : {};
}
