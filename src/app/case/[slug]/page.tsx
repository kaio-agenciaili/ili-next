import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseBlock } from "@/components/cases/CaseBlock";
import {
  CaseChallenge,
  CaseResults,
  CaseSolutions,
  CaseSolve,
  CaseStrategy,
  CaseTestimonial,
} from "@/components/cases/CaseSections";
import { Reveal, RevealLink } from "@/components/effects/Reveal";
import { CtaBanner } from "@/components/shared/CtaBanner";
import { getCase, getCaseCards, type CaseCard } from "@/lib/cms/wordpress";
import { trimWords } from "@/lib/html";
import { routes, site } from "@/lib/site";

/** Slug reservado só para o build passar se não houver cases (a lista de params não pode ser vazia). */
const NO_CASES = "__sem-cases__";

export async function generateStaticParams() {
  const cases = await getCaseCards();
  return (cases.length > 0 ? cases.map((c) => c.slug) : [NO_CASES]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/case/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = slug === NO_CASES ? null : await getCase(slug);
  if (!item) return {};
  return { title: item.seo.title ?? `${item.title} - ${site.name}`, description: item.seo.description };
}

function BackLink() {
  return (
    <RevealLink href={routes.cases} className="cs-back">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      voltar para cases
    </RevealLink>
  );
}

/** Resumo dos “outros cases”: 24 palavras do resumo manual ou do conteúdo. */
const relatedDescription = (item: CaseCard) => trimWords(item.manualExcerpt !== "" ? item.manualExcerpt : item.contentText, 24);

export default async function CasePage({ params }: PageProps<"/case/[slug]">) {
  // Lido fora de <Suspense>: slug inexistente responde 404 de verdade.
  const { slug } = await params;
  const item = slug === NO_CASES ? null : await getCase(slug);
  if (!item) notFound();

  const related = (await getCaseCards()).filter((c) => c.id !== item.id).slice(0, 2);
  const { titleHtml, bannerUrl } = item.hero;
  const showHero = titleHtml !== "" || bannerUrl !== "" || item.tags.length > 0;

  return (
    <>
      {showHero ? (
        <section className="cs-hero" style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : undefined}>
          <div className="container-ili">
            <BackLink />
            {titleHtml !== "" && (
              <div className="md:w-2/3">
                <Reveal as="h1" className="cs-hero-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
              </div>
            )}
            {item.tags.length > 0 && (
              <Reveal className="cs-hero-meta">
                {item.tags.map((tag) => (
                  <span key={tag} className="cs-tag">
                    {tag}
                  </span>
                ))}
              </Reveal>
            )}
          </div>
        </section>
      ) : (
        <div className="container-ili py-6">
          <BackLink />
        </div>
      )}

      <CaseChallenge item={item} />
      <CaseSolve item={item} />
      <CaseStrategy item={item} />
      <CaseTestimonial item={item} />
      <CaseSolutions item={item} />
      <CaseResults item={item} />

      <CtaBanner
        label="próximo passo"
        title={
          <>
            seu negócio pode ser o próximo <span className="text-accent">case de sucesso.</span>
          </>
        }
        description="solicite um diagnóstico gratuito e descubra onde estão as maiores oportunidades de crescimento do seu marketing."
      />

      {related.length > 0 && (
        <section className="cs-section cs-related">
          <div className="container-ili">
            <Reveal className="cs-related-header cs-related-header--center">
              <h2 className="cs-section-title">veja outros cases</h2>
            </Reveal>
            <div className="cp-others-grid">
              {related.map((rel) => (
                <CaseBlock key={rel.id} item={rel} size={6} description={relatedDescription(rel)} reveal />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
