import type { Metadata } from "next";
import Image from "next/image";
import { DraggableMarquee } from "@/components/effects/DraggableMarquee";
import { MagneticLink } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/Reveal";
import { getPageSeo } from "@/lib/cms/wordpress";
import { clientLogos } from "@/lib/clients";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("quem-somos");
  return { title: seo.title ?? "quem somos | agência ili", description: seo.description };
}

/** Espaçamentos utilitários do tema (.pt-80 / .pb-120), menores no mobile. */
const PT_80 = "pt-[80px] max-sm:pt-[60px]";
const PB_120 = "pb-[120px] max-sm:pb-[80px]";

const team = [
  { photo: "avatar-valesca.png", name: "Valesca Carvalho", role: "gerente de contas" },
  { photo: "avatar-and.png", name: "Anderson Kumagai", role: "fundador & sócio-diretor" },
  { photo: "avatar-kaio.png", name: "Kaio Mendes", role: "head de desenvolvimento e tecnologia" },
  { photo: "avatar-luana.png", name: "Luana Costa", role: "gerente de contas" },
  { photo: "avatar-guima.png", name: "Rodrigo Guimarães", role: "head de design" },
  { photo: "avatar-marcela.png", name: "Marcela Del Nero", role: "head de conteúdo" },
  { photo: "avatar-jed.png", name: "Jedson Santos", role: "desenvolvedor" },
  { photo: "avatar-douglas.png", name: "Douglas Alves", role: "motion designer" },
  { photo: "avatar-ju.png", name: "Julia Paiva", role: "designer" },
  { photo: "avatar-lucas.png", name: "Lucas Marques", role: "motion designer" },
  { photo: "avatar-thay.png", name: "Taynná Arruda", role: "analista de conteúdo" },
  { photo: "avatar-luiza.png", name: "Luiza Barth", role: "analista de conteúdo" },
  { photo: "avatar-amanda.png", name: "Amanda Tambara", role: "analista de conteúdo" },
  { photo: "avatar-eloisa.png", name: "Eloisa Bonfim", role: "analista de conteúdo" },
];

const method = [
  {
    letter: "L",
    title: "leitura do mercado",
    desc: "mergulhamos em dados e comportamento do consumidor para identificar oportunidades reais antes de criar qualquer coisa.",
  },
  {
    letter: "O",
    title: "otimização contínua",
    desc: "acompanhamos métricas e ajustamos rotas para manter as estratégias em alta performance. a melhoria faz parte do processo.",
  },
  {
    letter: "V",
    title: "visão de futuro",
    desc: "olhamos para frente para antecipar movimentos, inovar antes da concorrência e manter nossos clientes na dianteira.",
  },
  {
    letter: "E",
    title: "expertise",
    desc: "vivência, criatividade e domínio das ferramentas certas para transformar objetivos em resultados concretos.",
  },
];

/** [arquivo em /img/ferramentas, nome] */
const tools: [string, string][] = [
  ["adobe", "Adobe"],
  ["chatgpt", "ChatGPT"],
  ["claude", "Claude"],
  ["clickup", "ClickUp"],
  ["cursor", "Cursor"],
  ["discord", "Discord"],
  ["figma", "Figma"],
  ["gemini", "Gemini"],
  ["gettyimages", "Getty Images"],
  ["google-meet", "Google Meet"],
  ["google-drive", "Google Drive"],
  ["google", "Google"],
  ["krea", "Krea"],
  ["manus", "Manus"],
  ["microsoft", "Microsoft"],
  ["monday", "monday.com"],
  ["rd-station", "RD Station"],
  ["slack", "Slack"],
];

export default function AboutPage() {
  return (
    <>
      <section className="qs-hero hero-ili-sobre relative overflow-hidden bg-[url(/img/bg-sobre.png)]">
        <div className="container-ili relative z-1">
          <div className="grid items-center gap-x-6 lg:grid-cols-12">
            <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
            <div className="mb-12 lg:col-span-7 lg:mb-0">
              <Reveal as="h1" className="qs-hero-title">
                somos a parceira que entra no negócio, pensa junto e <br />
                faz <span className="text-accent">dar certo.</span>
              </Reveal>
              <Reveal as="p" className="qs-hero-desc">
                a ili existe para empresas que já entenderam que marketing precisa gerar resultado. aqui, estratégia vem
                antes de execução e cada decisão é orientada por dados, modelo de negócio e ambição real de crescimento.
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

      <section className={cx("qs-section", PB_120)}>
        <div className="container-ili">
          <Reveal className="qs-story">
            <div className="qs-story-copy">
              <div className="qs-story-text">
                <h3>
                  a ili nasceu ao ver empresas investindo em marketing sem retorno e agências entregando execução sem
                  pensar no negócio.
                </h3>
                <p>
                  o que guia nosso trabalho é a mentalidade de que cada real investido precisa voltar como crescimento.
                  por isso vendemos serviços com clareza estratégica e capacidade de execução.
                </p>
                <p>
                  construímos a ili para ser o tipo de parceira que você gostaria de ter: transparente, direta,
                  estratégica e obcecada por resultados. sem enrolação e sem métricas de vaidade.
                </p>
              </div>
              <div className="qs-story-signature">
                <strong>Anderson Kumagai</strong>
                <span>fundador & sócio-diretor</span>
              </div>
            </div>
            <div className="qs-story-visual">
              <div className="qs-story-aspas" aria-hidden="true">
                <Image src="/img/aspas.png" alt="" width={265} height={180} />
              </div>
              <Image
                className="qs-story-photo"
                src="/img/anderson-att.png"
                alt="Anderson — fundador da ili"
                width={495}
                height={668}
                sizes="(max-width: 991px) 360px, 400px"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className={cx("qs-section", PT_80, PB_120)}>
        <div className="container-ili">
          <div className="qs-split">
            <div className="qs-split-label">
              <h3 className="qs-method-title">
                método <span className="text-accent">l.o.v.e</span>
              </h3>
              <p className="qs-method-desc">
                crescimento consistente tem <br />
                processo. o nosso é o l.o.v.e.
              </p>
            </div>
            <Reveal className="qs-split-content">
              <div className="qs-method-steps">
                {method.map((step) => (
                  <Reveal key={step.letter} className="qs-method-step">
                    <span className="qs-method-letter">{step.letter}</span>
                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={cx("qs-section", PT_80, PB_120)}>
        <div className="container-ili">
          <div className="text-center">
            <Reveal as="h2" className="qs-team-heading">
              estratégia e execução feitas por <span className="text-accent">especialistas</span>
            </Reveal>
            <Reveal as="p" className="qs-team-sub">
              cada projeto tem gente real pensando, decidindo e respondendo.
            </Reveal>
          </div>
        </div>

        {/* A lista vai duplicada para o loop infinito do marquee. */}
        <DraggableMarquee reveal className={cx("qs-team-marquee", PT_80)} trackClassName="qs-team-track">
          {[...team, ...team].map((member, i) => (
            <div key={`${member.photo}-${i}`} className="qs-team-card">
              <div className="qs-team-img">
                <Image src={`/img/time/${member.photo}`} alt={member.name} width={445} height={445} sizes="200px" />
              </div>
              <h4>{member.name}</h4>
              <span>{member.role}</span>
            </div>
          ))}
        </DraggableMarquee>
      </section>

      <section className={cx("qs-section qs-clients-section", PT_80, PB_120)}>
        <div className="container-ili">
          <div className="qs-split">
            <div className="qs-split-label">
              <h3 className="qs-method-title">
                marcas que confiam na ili para construir <span className="text-accent">crescimento real</span>
              </h3>
            </div>
            <Reveal className="qs-split-content">
              <div className="qs-clients-grid">
                {clientLogos.map((logo) => (
                  <div key={logo.file} className="qs-client-logo">
                    <Image src={`/img/clientes/${logo.file}.png`} alt={logo.name} width={logo.width} height={logo.height} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={cx("qs-section qs-certs-section", PT_80, PB_120)}>
        <div className="container-ili">
          <Reveal className="qs-certs-header max-sm:text-left">
            <h2 className="qs-certs-title">
              certificações <span>&amp;</span> ferramentas
            </h2>
            <p className="qs-certs-intro">
              capacidade técnica real de execução. operamos as principais plataformas de mídia, dados e automação com
              proficiência certificada.
            </p>
          </Reveal>

          {/* A lista vai duplicada para o loop infinito; a cópia fica oculta para leitores de tela. */}
          <DraggableMarquee reveal className={cx("qs-certs-marquee", PT_80)} trackClassName="qs-certs-track">
            {[0, 1].flatMap((pass) =>
              tools.map(([file, name]) => (
                <div key={`${file}-${pass}`} className="qs-certs-logo" aria-hidden={pass === 1 ? true : undefined}>
                  <Image src={`/img/ferramentas/${file}.png`} alt={name} width={144} height={85} />
                </div>
              )),
            )}
          </DraggableMarquee>
        </div>
      </section>
    </>
  );
}
