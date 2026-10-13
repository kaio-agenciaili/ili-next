import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogCard, BlogMeta } from "@/components/blog/BlogCard";
import { Newsletter } from "@/components/blog/Newsletter";
import { Reveal } from "@/components/effects/Reveal";
import { getCategories, getCategoryPosts, getLatestPosts, getPageSeo, type BlogCategory, type PostCard } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("blog");
  return { title: seo.title ?? "blog | agência ili", description: seo.description };
}

/** Seções de categoria na ordem do tema; a newsletter entra depois da segunda. */
const SECTIONS = [
  { slug: "estrategia", title: "estratégia" },
  { slug: "marca", title: "marca" },
  { slug: "performance", title: "performance" },
  { slug: "dados", title: "dados" },
  { slug: "tendencias", title: "tendências" },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function SideCard({ post }: { post: PostCard }) {
  return (
    <Link href={routes.post(post.slug)} className="blog-spotlight-side-card">
      <div className="blog-spotlight-side-img">
        {post.image && (
          <Image src={post.image.url} alt={post.title} width={post.image.width} height={post.image.height} sizes="(max-width: 991px) 50vw, 220px" />
        )}
      </div>
      <div className="blog-spotlight-side-body">
        <span className="blog-tag">{post.category?.name ?? "blog"}</span>
        <h3 className="blog-spotlight-side-title">{post.title}</h3>
        <BlogMeta post={post} />
      </div>
    </Link>
  );
}

async function CategorySection({ title, category, exclude }: { title: string; category: BlogCategory | undefined; exclude: number[] }) {
  const posts = category ? await getCategoryPosts(category.id, 4, exclude) : [];

  return (
    <Reveal as="section" className="blog-cat-section">
      <div className="container-ili">
        <div className="blog-cat-header">
          <h2 className="blog-cat-title">{title}</h2>
          <Link href={category ? routes.categoria(category.slug) : "#"} className="blog-cat-link">
            ver todos <ArrowIcon />
          </Link>
        </div>
        <div className="blog-cat-scroll">
          {category && posts.map((post) => <BlogCard key={post.id} post={post} tag={category.name} />)}
        </div>
      </div>
    </Reveal>
  );
}

export default async function BlogPage() {
  const [spotlight, categories] = await Promise.all([getLatestPosts(3), getCategories()]);
  const [main, side1, side2] = spotlight;
  const exclude = spotlight.map((p) => p.id);
  const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

  const sections = SECTIONS.map((s) => (
    <CategorySection key={s.slug} title={s.title} category={categoryBySlug(s.slug)} exclude={exclude} />
  ));

  return (
    <>
      <section className="blog-hero">
        <div className="container-ili relative z-1">
          <Reveal as="p" className="svc-hero-heading">
            blog ili
          </Reveal>
          <Reveal as="h1" className="section-heading text-grad max-w-[700px]">
            perspectivas de quem vive <br />o mercado todos os dias
          </Reveal>
        </div>
      </section>

      <Reveal as="section" className="blog-spotlight">
        <div className="container-ili">
          <div className="blog-spotlight-grid">
            {main && (
              <Link href={routes.post(main.slug)} className="blog-spotlight-main">
                <div className="blog-spotlight-main-img">
                  {main.image && (
                    <Image src={main.image.url} alt={main.title} width={main.image.width} height={main.image.height} sizes="(max-width: 991px) 100vw, 760px" />
                  )}
                </div>
                <div className="blog-spotlight-main-body">
                  <span className="blog-tag">{main.category?.name ?? "blog"}</span>
                  <h2 className="blog-spotlight-main-title">{main.title}</h2>
                  <p className="blog-spotlight-main-excerpt">{main.excerpt}</p>
                  <BlogMeta post={main} long />
                </div>
              </Link>
            )}

            <div className="blog-spotlight-side">
              {side1 && <SideCard post={side1} />}
              {side2 && <SideCard post={side2} />}
            </div>
          </div>
        </div>
      </Reveal>

      {sections.slice(0, 2)}
      <Newsletter reveal />
      {sections.slice(2)}
    </>
  );
}
