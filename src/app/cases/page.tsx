import type { Metadata } from "next";
import Link from "next/link";
import { CaseBlock } from "@/components/cases/CaseBlock";
import { QuoteCarousel, type Quote } from "@/components/cases/QuoteCarousel";
import { MagneticLink } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/Reveal";
import { getCaseCards, getPageSeo, type CaseCard } from "@/lib/cms/wordpress";
import { trimWords } from "@/lib/html";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("cases");
  return { title: seo.title ?? "cases | agência ili", description: seo.description };
}

/** Case em destaque no topo (no tema, fixo pelo slug; se não existir, o mais recente). */
const FEATURED_SLUG = "lets-atlantica";

/** Depoimentos fixos do tema. */
const quotes: Quote[] = [
  {
    text: "“na ili, o dia a dia dos projetos é dinâmico, ágil e, acima de tudo, criativo. soluções rápidas, de um time sempre ligado nas inovações do mercado, como ia, garantem um ótimo andamento e uma gestão de marca eficiente.”",
    name: "Leonardo Boulos",
    photo: "/img/leo.png",
    role: (
      <>
        sócio diretor da <span className="text-accent">DOT - Packaging Design &amp; Education</span>
      </>
    ),
  },
  {
    text: "“a ili é uma agência muito parceira, ágil, dedicada e focada em resultado. tem um time coeso e preocupado com o relacionamento com o cliente. são tão próximos, e imersos nos projetos, que é como se fossem a nossa extensão. trazem soluções e fomentam inovações.”",
    name: "Renata Vaterkemper",
    photo: "/img/renata.png",
    role: (
      <>
        gerente de comunicação da <span className="text-accent">Atlantica Hospitality Intemational</span>
      </>
    ),
  },
  {
    text: "“a ili se destaca pela agilidade nas entregas e pela qualidade do trabalho. é nítido que eles usam a inteligência artificial de forma estratégica pra otimizar processos e melhorar ainda mais os resultados.”",
    name: "Marcelo Mendonça",
    photo: "/img/marcelo.png",
    role: (
      <>
        sócio e fundador da <span className="text-accent">Smartset Labs</span>
      </>
    ),
  },
];

/** Resumo dos cards: resumo manual ou 36 palavras do conteúdo. */
const cardDescription = (item: CaseCard) => (item.manualExcerpt !== "" ? item.manualExcerpt : trimWords(item.contentText, 36));

export default async function CasesPage() {
  const cases = await getCaseCards();
  const featured = cases.find((c) => c.slug === FEATURED_SLUG) ?? cases[0];
  const others = featured ? cases.filter((c) => c.id !== featured.id).slice(0, 8) : cases.slice(0, 3);

  return (
    <>
      <section className="qs-hero hero-cases relative overflow-hidden bg-[url(/img/bg-cases.png)]">
        <div className="container-ili relative z-1">
          <div className="grid items-center gap-x-6 lg:grid-cols-12">
            <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
            <div className="mb-12 lg:col-span-7 lg:mb-0">
              <Reveal as="h1" className="qs-hero-title">
                estratégia que se prova <br />
                nos <span className="text-accent">resultados</span>
              </Reveal>
              <Reveal as="p" className="qs-hero-desc">
                cada projeto aqui é a evidência de que método, posicionamento e execução integrada transformam negócios.
                sem achismo. <br />
                só resultado documentado.
              </Reveal>
              <Reveal className="qs-hero-cta">
                <MagneticLink href={routes.diagnostico} className="btn-ili btn-lg">
                  quero conversar sobre meu negócio
                </MagneticLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <Reveal as="section" className="cp-feat">
          <div className="container-ili">
            <CaseBlock item={featured} size={12} description={cardDescription(featured)} maxTags={4} />
          </div>
        </Reveal>
      )}

      <section className="cp-others">
        <div className="container-ili">
          <div className="cp-others-grid">
            {others.map((item) => (
              <CaseBlock key={item.id} item={item} size={6} description={cardDescription(item)} maxTags={4} reveal />
            ))}
          </div>
        </div>
      </section>

      <Reveal
        as="section"
        className="csb csb-quote pt-[80px] pb-[120px] max-sm:pt-[60px] max-sm:pb-[80px]"
        aria-label="Carrossel de depoimentos"
      >
        <div className="container-ili">
          <QuoteCarousel quotes={quotes} />
        </div>
      </Reveal>

      <Reveal as="section" className="cp-cta">
        <div className="cp-cta-inner">
          <p className="cp-cta-label">próximo passo</p>
          <h2 className="cp-cta-heading">
            seu negócio pode ser o próximo <span className="text-accent">case de sucesso.</span>
          </h2>
          <p className="cp-cta-desc">
            uma conversa estratégica é o primeiro passo. solicite um diagnóstico e descubra o que está travando seu
            crescimento.
          </p>
          <Link href={routes.diagnostico} className="btn-ili btn-lg">
            quero um diagnóstico gratuito
          </Link>
        </div>
      </Reveal>
    </>
  );
}
