import Image from "next/image";
import Link from "next/link";
import { RevealLink } from "@/components/effects/Reveal";
import type { PostCard } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

export function BlogMeta({ post, long = false }: { post: PostCard; long?: boolean }) {
  return (
    <div className="blog-meta">
      <span>{post.date}</span>
      <span>·</span>
      <span>{post.minutes} {long ? "min de leitura" : "min"}</span>
    </div>
  );
}

type BlogCardProps = {
  post: PostCard;
  /** Texto da etiqueta; o padrão é a categoria principal do post (ou "blog"). */
  tag?: string;
  reveal?: boolean;
};

/** Card de post (`.blog-card`): seções de categoria, arquivo de categoria e “continue lendo”. */
export function BlogCard({ post, tag, reveal = false }: BlogCardProps) {
  const LinkTag = reveal ? RevealLink : Link;

  return (
    <LinkTag href={routes.post(post.slug)} className="blog-card">
      <div className="blog-card-img">
        {post.image && (
          <Image
            src={post.image.url}
            alt={post.title}
            width={post.image.width}
            height={post.image.height}
            sizes="(max-width: 575px) 100vw, 420px"
          />
        )}
      </div>
      <div className="blog-card-body">
        <span className="blog-tag">{tag ?? post.category?.name ?? "blog"}</span>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <BlogMeta post={post} />
      </div>
    </LinkTag>
  );
}
