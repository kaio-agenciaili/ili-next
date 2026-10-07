import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { routes } from "@/lib/site";

const shortcuts: { slug: string; title: string; desc: ReactNode }[] = [
  { slug: "branding", title: "branding", desc: "posicionamento e construção de marca" },
  { slug: "design", title: "design", desc: "direção criativa e materiais visuais" },
  { slug: "conteudo", title: "conteúdo", desc: "redes sociais, blog, newsletter e mais" },
  { slug: "videos", title: "vídeos", desc: <>edição, motion <br />e ia</> },
  { slug: "midia", title: "mídia paga", desc: "gestão de tráfego e performance" },
  { slug: "tecnologia", title: "tecnologia", desc: <>websites, hotsites e <br />e-commerce</> },
];

export function ServiceShortcuts() {
  return (
    <section className="svc-hero-section">
      <div className="container-ili">
        <Reveal as="p" className="svc-hero-heading">
          o que podemos fazer para impulsionar seu negócio
        </Reveal>
        <Reveal cascade className="svc-hero-grid">
          {shortcuts.map((item, i) => (
            <Link key={item.slug} href={routes.servico(item.slug)} className="svc-hero-card">
              <div className="svc-hero-card-top">
                <span className="svc-hero-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="svc-hero-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </div>
              <div className="svc-hero-card-bottom">
                <h4 className="svc-hero-title">{item.title}</h4>
                <p className="svc-hero-desc">{item.desc}</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
