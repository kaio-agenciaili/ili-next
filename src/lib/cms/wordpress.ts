import { cacheLife, cacheTag } from "next/cache";
import { decodeEntities, stripTags, trimWords } from "@/lib/html";

/**
 * Acesso ao WordPress headless (REST API + ACF).
 * Todo o resto do app consome só as funções/tipos exportados daqui,
 * então trocar de CMS no futuro mexe apenas nesta pasta.
 */

const WP_URL = (process.env.WP_URL ?? "http://localhost/ili").replace(/\/$/, "");

type WpImage = { url: string; width: number; height: number; alt: string } | false | null;

type WpRendered = { rendered: string };

type WpCase = {
  id: number;
  slug: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  acf: {
    banner?: WpImage;
    lista_resultados?: { numero?: string; descricao?: string }[] | false | null;
    tags?: { tag?: string }[] | false | null;
    texto_depoimento?: string;
    nome?: string;
    cargo?: string;
    empresa?: string;
    foto?: WpImage;
  };
  _embedded?: { "wp:featuredmedia"?: { source_url: string; media_details?: { width: number; height: number } }[] };
};

export type CmsImage = { url: string; width: number; height: number; alt: string };

export type HomeCase = {
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

async function wpFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = `${WP_URL}/wp-json/wp/v2/${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WordPress respondeu ${res.status} em ${url}`);
  }
  return res.json() as Promise<T>;
}

function toImage(img: WpImage | undefined, fallbackAlt: string): CmsImage | null {
  if (!img || !img.url) return null;
  return { url: img.url, width: img.width, height: img.height, alt: img.alt || fallbackAlt };
}

function clean(value: unknown): string {
  return typeof value === "string" ? stripTags(value) : "";
}

/** Cases do carrossel da Home (mesma regra do `home.php`). */
export async function getHomeCases(): Promise<HomeCase[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cases");

  const posts = await wpFetch<WpCase[]>("ili_case", {
    per_page: "8",
    orderby: "date",
    order: "asc",
    acf_format: "standard",
    _embed: "wp:featuredmedia",
  });

  return posts.map((post) => {
    const acf = post.acf ?? {};
    const title = decodeEntities(post.title.rendered);

    let banner = toImage(acf.banner, title);
    const featured = post._embedded?.["wp:featuredmedia"]?.[0];
    if (!banner && featured) {
      banner = {
        url: featured.source_url,
        width: featured.media_details?.width ?? 1400,
        height: featured.media_details?.height ?? 900,
        alt: title,
      };
    }

    const stats = (Array.isArray(acf.lista_resultados) ? acf.lista_resultados : [])
      .map((row) => ({ numero: clean(row?.numero), descricao: clean(row?.descricao) }))
      .filter((row) => row.numero !== "" || row.descricao !== "")
      .slice(0, 3);

    const tags =
      stats.length > 0
        ? []
        : (Array.isArray(acf.tags) ? acf.tags : [])
            .map((row) => clean(row?.tag))
            .filter(Boolean)
            .slice(0, 3);

    const quoteHtml = typeof acf.texto_depoimento === "string" ? acf.texto_depoimento.trim() : "";
    const name = typeof acf.nome === "string" ? acf.nome.trim() : "";
    const role = typeof acf.cargo === "string" ? acf.cargo.trim() : "";
    const company = typeof acf.empresa === "string" ? acf.empresa.trim() : "";
    const photo = toImage(acf.foto, name || title);
    const hasTestimonial = stripTags(quoteHtml) !== "" || name !== "" || role !== "" || company !== "" || photo !== null;

    // O tema só usa o resumo manual; o automático da REST termina em "[…]".
    const isAutoExcerpt = post.excerpt.rendered.includes("[&hellip;]");
    let summary = isAutoExcerpt ? "" : stripTags(post.excerpt.rendered);
    if (summary === "") summary = stripTags(post.content.rendered);
    if (summary !== "") summary = trimWords(summary, 48);

    return {
      id: post.id,
      slug: post.slug,
      title,
      banner,
      stats,
      tags,
      testimonial: hasTestimonial ? { html: stripTags(quoteHtml) !== "" ? quoteHtml : "", name, role, company, photo } : null,
      summary,
    };
  });
}
