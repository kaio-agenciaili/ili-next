import { Fragment } from "react";
import { Reveal } from "@/components/effects/Reveal";
import type { Service } from "@/lib/cms/wordpress";
import { ServiceCard } from "./ServiceCard";

type RelatedServicesProps = {
  service: Service;
  related: Service[];
};

export function RelatedServices({ service, related }: RelatedServicesProps) {
  return (
    <section className="sv-related">
      <div className="container-ili">
        <Reveal as="h2" className="sv-related-title">
          serviços que se <span className="text-accent">conectam com {service.title}</span>
        </Reveal>

        {service.relatedText !== "" && (
          <Reveal as="p" className="sv-related-desc">
            {/* Mesmo efeito do nl2br do tema. */}
            {service.relatedText.split(/\r?\n/).map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </Reveal>
        )}

        {related.length > 0 && (
          <div className="sv-related-grid">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
