import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { Newsletter } from "@/components/blog/Newsletter";
import { Reveal } from "@/components/effects/Reveal";
import { getCategory, getCategoryArchive } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

export async function categoryMetadata(slug: string): Promise<Metadata> {
  const category = await getCategory(slug);
  if (!category) return {};
  return { title: category.seo.title ?? `${category.name} | agência ili`, description: category.seo.description };
}

/** Mesma lógica do `paginate_links()` do WordPress (mid_size 2, end_size 1). */
function pageItems(current: number, total: number) {
  const items: ({ type: "page"; n: number } | { type: "dots" })[] = [];
  let dots = false;
  for (let n = 1; n <= total; n++) {
    const near = n >= current - 2 && n <= current + 2;
    if (n <= 1 || n > total - 1 || near) {
      items.push({ type: "page", n });
      dots = true;
    } else if (dots) {
      items.push({ type: "dots" });
      dots = false;
    }
  }
  return items;
}

function Pagination({ slug, current, total }: { slug: string; current: number; total: number }) {
  if (total < 2) return null;
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-[0.6rem]">
      {current > 1 && (
        <span>
          <Link className="prev page-numbers" href={routes.categoria(slug, current - 1)}>
            ←
          </Link>
        </span>
      )}
      {pageItems(current, total).map((item, i) =>
        item.type === "dots" ? (
          <span key={`dots-${i}`}>
            <span className="page-numbers dots">…</span>
          </span>
        ) : item.n === current ? (
          <span key={item.n}>
            <span aria-current="page" className="page-numbers current">
              {item.n}
            </span>
          </span>
        ) : (
          <span key={item.n}>
            <Link className="page-numbers" href={routes.categoria(slug, item.n)}>
              {item.n}
            </Link>
          </span>
        ),
      )}
      {current < total && (
        <span>
          <Link className="next page-numbers" href={routes.categoria(slug, current + 1)}>
            →
          </Link>
        </span>
      )}
    </div>
  );
}

/** Arquivo de uma categoria do blog (`category.php` do tema). */
export async function CategoryArchive({ slug, page }: { slug: string; page: number }) {
  const category = await getCategory(slug);
  if (!category) notFound();

  const { posts, totalPages } = await getCategoryArchive(category.id, page);
  // Página além da última não existe no WordPress.
  if (page > 1 && posts.length === 0) notFound();

  return (
    <>
      <section className="blog-hero">
        <div className="container-ili relative z-1">
          <Reveal as="p" className="svc-hero-heading">
            categoria
          </Reveal>
          <Reveal as="h1" className="section-heading text-grad max-w-[700px]">
            {category.name}
          </Reveal>
          {category.description !== "" && (
            <Reveal as="p" className="section-subheading mt-4 max-w-[720px]">
              {category.description}
            </Reveal>
          )}
        </div>
      </section>

      <Reveal as="section" className="blog-cat-section">
        <div className="container-ili">
          <div className="blog-cat-header">
            <h2 className="blog-cat-title">{category.name}</h2>
            <Link href={routes.blog} className="blog-cat-link">
              ver todos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {posts.length > 0 ? (
            <>
              <div className="blog-grid">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} tag={post.category?.name ?? category.name} />
                ))}
              </div>
              <Pagination slug={category.slug} current={page} total={totalPages} />
            </>
          ) : (
            <div className="blog-card p-6">
              <p className="m-0 text-white/55">Nenhum post encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </Reveal>

      <Newsletter />
    </>
  );
}
