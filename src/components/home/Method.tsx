import { MagneticLink } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/Reveal";
import { TiltCard } from "@/components/effects/TiltCard";
import { routes } from "@/lib/site";

const steps = [
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

export function Method() {
  return (
    <section id="metodo" className="section-ili">
      <div className="container-ili relative z-1">
        <Reveal className="mb-12 text-center max-sm:text-left">
          <h2 className="section-heading text-grad mx-auto">
            metodologia <span className="text-accent">l.o.v.e</span>
          </h2>
          <p className="section-subheading mx-auto mt-4 max-w-[600px]">
            nosso trabalho segue um processo claro, que organiza como pensamos, executamos e evoluímos cada projeto.
          </p>
        </Reveal>

        <Reveal cascade className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.letter}>
              <TiltCard className="card-love noise-overlay card-inner-glow gradient-border h-full">
                <div className="love-letter">{step.letter}</div>
                <div className="love-title">{step.title}</div>
                <div className="love-desc">{step.desc}</div>
              </TiltCard>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12 text-center">
          <MagneticLink href={routes.diagnostico} className="btn-ili btn-lg">
            quero entender como isso se aplica ao meu negócio
          </MagneticLink>
        </Reveal>
      </div>
    </section>
  );
}
