import { RevealLink } from "@/components/effects/Reveal";
import type { Service } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

/** Card de serviço (`.cf-card`): listagem /servicos/ e “serviços que se conectam”. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <RevealLink href={routes.servico(service.slug)} className="cf-card">
      <div className="cf-card-glow" />

      <div className="cf-card-body">
        <h3 className="cf-card-title">{service.title}</h3>
        {service.summary !== "" && <p className="cf-card-desc">{service.summary}</p>}
        {service.tags.length > 0 && (
          <div className="cf-card-tags">
            {service.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
      <span className="cf-card-link">
        conhecer serviço{" "}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </span>
    </RevealLink>
  );
}
