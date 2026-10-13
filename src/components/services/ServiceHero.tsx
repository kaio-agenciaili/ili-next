import Image from "next/image";
import { BackgroundVideo } from "@/components/effects/BackgroundVideo";
import { Reveal, RevealLink } from "@/components/effects/Reveal";
import type { Service } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

export function ServiceHero({ service }: { service: Service }) {
  const { banner } = service;

  return (
    <section className="sv-hero sv-hero--bg">
      {banner?.kind === "video" && <BackgroundVideo className="sv-hero-bg-img" src={banner.url} type={banner.mime} />}
      {banner?.kind === "image" && (
        <Image className="sv-hero-bg-img" src={banner.url} alt="" fill sizes="100vw" priority />
      )}

      <div className="container-ili relative z-[2]">
        <RevealLink href={routes.servicos} className="cs-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          todos os serviços
        </RevealLink>

        <div className="sv-hero-split">
          <div className="sv-hero-left">
            <Reveal as="h1" className="sv-hero-title">
              {service.title}
            </Reveal>
          </div>

          <div className="sv-hero-right">
            {service.contentHtml !== "" && (
              // Conteúdo do editor do WordPress (`the_content`).
              <Reveal className="sv-hero-desc" dangerouslySetInnerHTML={{ __html: service.contentHtml }} />
            )}

            {service.tags.length > 0 && (
              <Reveal className="sv-hero-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
