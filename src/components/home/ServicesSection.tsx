import Link from "next/link";
import { routes } from "@/lib/site";
import { ServicesTimeline, type TimelineItem } from "./ServicesTimeline";

const items: TimelineItem[] = [
  {
    title: "estruturar minha marca",
    desc: "uma marca que comunica com clareza, sustenta posicionamento e acompanha o nível atual do negócio.",
    href: routes.servico("branding"),
  },
  {
    title: "desenvolver estratégia e planejamento",
    desc: "direcionamento claro sobre onde investir, o que priorizar e como sustentar crescimento ao longo do tempo.",
    href: routes.servico("branding"),
  },
  {
    title: "melhorar presença e comunicação",
    desc: "uma comunicação consistente, com clareza de mensagem e presença alinhada em todos os canais.",
    href: routes.servico("conteudo"),
  },
  {
    title: "gerar leads e performance",
    desc: "entrada contínua de leads qualificados, com previsibilidade e acompanhamento dos resultados.",
    href: routes.servico("midia"),
  },
  {
    title: "evoluir design e produção criativa",
    desc: "materiais e campanhas com consistência visual e qualidade, alinhados ao posicionamento da marca.",
    href: routes.servico("design"),
  },
  {
    title: "impulsionar dados e tecnologia",
    desc: "dados estruturados e acessíveis para orientar decisões e acompanhar o desempenho do marketing.",
    href: routes.servico("tecnologia"),
  },
];

export function ServicesSection() {
  return (
    <div id="servicos" className="svc-section">
      <div className="svc-split">
        <div className="svc-left">
          <span className="svc-left-tag">nossos serviços</span>
          <h2 className="section-heading text-grad">
            que tipo <br />
            de ajuda sua <br />
            empresa precisa?
          </h2>
          <p className="svc-left-desc">
            partimos do seu momento atual e definimos um caminho claro de crescimento, com estratégia e execução.
          </p>
          <Link href={routes.diagnostico} className="btn-ili btn-lg">
            quero um diagnóstico
          </Link>
        </div>

        <ServicesTimeline items={items} />
      </div>
    </div>
  );
}
