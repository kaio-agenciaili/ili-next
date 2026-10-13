import Image from "next/image";
import Link from "next/link";
import { RevealLink } from "@/components/effects/Reveal";
import type { CaseCard } from "@/lib/cms/wordpress";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

type CaseBlockProps = {
  item: CaseCard;
  /** 12 = destaque largo da listagem; 6 = meia coluna. */
  size: 12 | 6;
  description: string;
  /** Máximo de tags na imagem (a listagem mostra até 4; “outros cases”, todas). */
  maxTags?: number;
  reveal?: boolean;
};

/** Card de case (`.cp-block`): imagem com tags + título, resumo e resultados. */
export function CaseBlock({ item, size, description, maxTags, reveal = false }: CaseBlockProps) {
  const LinkTag = reveal ? RevealLink : Link;
  const Title = size === 12 ? "h2" : "h3";
  const tags = maxTags ? item.tags.slice(0, maxTags) : item.tags;

  return (
    <LinkTag href={routes.caso(item.slug)} className={cx("cp-block", `cp-block--${size}`)}>
      <div className="cp-block-img">
        {item.banner && (
          <Image
            src={item.banner.url}
            alt={item.title}
            width={item.banner.width}
            height={item.banner.height}
            // Imagem recortada (object-fit: cover): pode renderizar mais larga que o card.
            sizes={size === 12 ? "(max-width: 1400px) 100vw, 1296px" : "(max-width: 767px) 100vw, 900px"}
          />
        )}
        {tags.length > 0 && (
          <div className="cp-block-img-tags">
            {tags.map((tag) => (
              <span key={tag} className="cp-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="cp-block-body">
        <Title className={cx("cp-block-title", size === 12 && "cp-block-title--lg")}>{item.title}</Title>
        {description !== "" && <p className="cp-block-desc">{description}</p>}
        {item.stats.length > 0 && (
          <div className="cp-block-stats">
            {item.stats.map((stat, i) => (
              <div key={i} className="cp-stat">
                {stat.numero !== "" && <strong>{stat.numero}</strong>}
                {stat.descricao !== "" && <span>{stat.descricao}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </LinkTag>
  );
}
