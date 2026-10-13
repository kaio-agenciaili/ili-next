import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { routes } from "@/lib/site";

/** Conteúdo fixo (JSX) ou HTML vindo do CMS. */
type Content = ReactNode | { html: string };

function isHtml(content: Content): content is { html: string } {
  return typeof content === "object" && content !== null && "html" in content;
}

type CtaBannerProps = {
  label?: string;
  title: Content;
  description: Content;
  buttonLabel?: string;
};

/** CTA de encerramento das páginas internas (`.cs-cta`). */
export function CtaBanner({ label, title, description, buttonLabel = "quero um diagnóstico gratuito" }: CtaBannerProps) {
  return (
    <Reveal as="section" className="cs-cta">
      <div className="cs-cta-inner">
        {label && <p className="cs-cta-label">{label}</p>}
        {isHtml(title) ? (
          <h2 className="cs-cta-heading" dangerouslySetInnerHTML={{ __html: title.html }} />
        ) : (
          <h2 className="cs-cta-heading">{title}</h2>
        )}
        {isHtml(description) ? (
          <p className="cs-cta-desc" dangerouslySetInnerHTML={{ __html: description.html }} />
        ) : (
          <p className="cs-cta-desc">{description}</p>
        )}
        <Link href={routes.diagnostico} className="btn-ili btn-lg">
          {buttonLabel}
        </Link>
      </div>
    </Reveal>
  );
}
