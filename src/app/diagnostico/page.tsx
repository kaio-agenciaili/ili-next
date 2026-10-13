import type { Metadata } from "next";
import { DiagnosticForm } from "@/components/contact/DiagnosticForm";
import { Reveal } from "@/components/effects/Reveal";
import { getCf7Config, getPageSeo } from "@/lib/cms/wordpress";
import { cf7Forms } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("diagnostico");
  return { title: seo.title ?? "diagnóstico | agência ili", description: seo.description };
}

const faq = [
  {
    question: "o diagnóstico é realmente gratuito?",
    answer:
      "sim. é uma análise inicial para entender o cenário e mapear oportunidades. não tem custo, não tem pegadinha. se fizer sentido para os dois lados, a gente evolui a conversa.",
  },
  {
    question: "quanto tempo leva para receber o diagnóstico?",
    answer:
      "após preencher o formulário, retornamos em até 24h úteis para agendar a conversa. o diagnóstico completo é entregue em até 5 dias úteis após a reunião inicial.",
  },
  {
    question: "preciso ter um orçamento definido?",
    answer:
      "não. o diagnóstico existe justamente para dar clareza. a partir dele, apresentamos uma proposta com escopo e investimento alinhados à realidade.",
  },
  {
    question: "para que tipo de empresa o diagnóstico faz sentido?",
    answer:
      "empresas que já faturam e querem estruturar ou escalar o marketing. se você sente que investe mas não vê retorno proporcional, faz sentido conversar.",
  },
  {
    question: "o que acontece depois do diagnóstico?",
    answer:
      "você recebe um mapa claro de oportunidades e próximos passos. se quiser seguir com a ili, montamos uma proposta. se não, o diagnóstico é seu. sem compromisso.",
  },
];

export default async function DiagnosticPage() {
  const cf7 = await getCf7Config(cf7Forms.diagnostico.formId, cf7Forms.diagnostico.pageSlug);

  return (
    <>
      <section className="contact-split">
        <div className="container-ili">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="contact-left">
                <Reveal as="p" className="svc-hero-heading">
                  diagnóstico gratuito
                </Reveal>

                <Reveal as="h1" className="contact-heading">
                  descubra o que está <br />
                  travando o <span className="text-accent">crescimento</span> <br />
                  do seu marketing
                </Reveal>
              </div>
            </div>

            <div>
              <Reveal className="contact-form-card">
                <DiagnosticForm config={cf7} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Reveal as="section" className="contact-faq">
        <div className="container-ili">
          <div className="grid gap-x-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="section-heading text-grad sticky top-[8rem]">perguntas frequentes</h2>
            </div>
            <div className="lg:col-span-7">
              <div className="contact-faq-list">
                {faq.map((item) => (
                  <details key={item.question} className="contact-faq-item">
                    <summary className="contact-faq-question">{item.question}</summary>
                    <p className="contact-faq-answer">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
