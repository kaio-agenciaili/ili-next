import { Reveal, RevealLink } from "@/components/effects/Reveal";
import { Timeline } from "@/components/effects/Timeline";
import type { Service } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

/** O que o serviço entrega: título à esquerda e a lista (`lista_do_servico`) em timeline. */
export function ServiceDetails({ service }: { service: Service }) {
  return (
    <section className="svc-section">
      <div className="container-ili">
        <div className="svc-split">
          <div className="svc-left">
            {service.introHtml !== "" && (
              <Reveal as="h2" className="section-heading text-grad" dangerouslySetInnerHTML={{ __html: service.introHtml }} />
            )}

            <RevealLink href={routes.diagnostico} className="btn-ili btn-lg">
              quero falar sobre meu negócio
            </RevealLink>
          </div>

          {service.items.length > 0 ? (
            <Timeline>
              {service.items.map((item, i) => (
                <div key={i} className="svc-card noise-overlay">
                  <div className="timeline-dot" />
                  <div className="svc-card-content">
                    {item.title !== "" && <h4 className="svc-card-title">{item.title}</h4>}
                    {item.descHtml !== "" && (
                      <div className="svc-card-desc" dangerouslySetInnerHTML={{ __html: item.descHtml }} />
                    )}
                  </div>
                </div>
              ))}
            </Timeline>
          ) : (
            <div className="svc-right" />
          )}
        </div>
      </div>
    </section>
  );
}
