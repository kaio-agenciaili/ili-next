import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, BlogMeta } from "@/components/blog/BlogCard";
import { Newsletter } from "@/components/blog/Newsletter";
import { Reveal } from "@/components/effects/Reveal";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/cms/wordpress";
import { routes, site } from "@/lib/site";
import "@/styles/wp-blocks.css";

/** Slug reservado só para o build passar quando ainda não há posts (com Cache Components a lista não pode ser vazia). */
const NO_POSTS = "__sem-posts__";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return (slugs.length > 0 ? slugs : [NO_POSTS]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = slug === NO_POSTS ? null : await getPost(slug);
  if (!post) return {};
  return { title: post.seo.title ?? `${post.title} - ${site.name}`, description: post.seo.description };
}

/** Coluna central de 8/12 (`.col-lg-8` centralizada do tema). */
function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-x-6 lg:grid-cols-12">
      <div className="lg:col-span-8 lg:col-start-3">{children}</div>
    </div>
  );
}

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  // Lido fora de <Suspense>: slug inexistente responde 404 de verdade.
  const { slug } = await params;
  const post = slug === NO_POSTS ? null : await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const permalink = `${site.url}${routes.post(post.slug)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(permalink)}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(permalink)}&text=${encodeURIComponent(post.title)}`;

  return (
    <>
      <section className="post-hero">
        <div className="container-ili relative z-1">
          <Link href={routes.blog} className="post-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            voltar ao blog
          </Link>

          <div className="post-meta-top">
            <span className="blog-tag">{post.category?.name ?? "blog"}</span>
            <BlogMeta post={post} long />
          </div>

          <h1 className="post-title text-grad">{post.title}</h1>

          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </section>

      <section className="post-cover">
        <div className="container-ili">
          <div className="post-cover-img">
            {post.image && (
              <Image
                src={post.image.url}
                alt={post.title}
                width={post.image.width}
                height={post.image.height}
                sizes="(max-width: 1400px) 100vw, 1296px"
                priority
              />
            )}
          </div>
        </div>
      </section>

      <article className="post-content">
        <div className="container-ili">
          <div className="grid gap-x-6 lg:grid-cols-12">
            {/* HTML do editor do WordPress (`the_content`). */}
            <div className="lg:col-span-8 lg:col-start-3" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </div>
        </div>
      </article>

      <section className="post-share">
        <div className="container-ili">
          <Column>
            <div className="post-share-bar">
              <span className="post-share-label">compartilhar</span>
              <div className="post-share-links">
                <a href={linkedinShare} className="post-share-btn" aria-label="Compartilhar no LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href={xShare} className="post-share-btn" aria-label="Compartilhar no X" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href={permalink} className="post-share-btn" aria-label="Copiar link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </a>
              </div>
            </div>
          </Column>
        </div>
      </section>

      <section className="post-author-section">
        <div className="container-ili">
          <Column>
            <div className="post-author-card">
              {post.author.avatar && (
                // Gravatar: imagem externa pequena, sem passar pelo otimizador.
                <Image src={post.author.avatar} alt={post.author.name} width={160} height={160} className="post-author-avatar" unoptimized />
              )}
              <div className="post-author-info">
                <span className="post-author-label">escrito por</span>
                <h4 className="post-author-name">{post.author.name}</h4>
                {post.author.bio && <p className="post-author-bio">{post.author.bio}</p>}
              </div>
            </div>
          </Column>
        </div>
      </section>

      <section className="post-related">
        <div className="container-ili">
          <Reveal as="h2" className="section-heading text-grad mb-10">
            continue lendo
          </Reveal>
          <div className="blog-grid">
            {related.map((item) => (
              <BlogCard key={item.id} post={item} reveal />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
