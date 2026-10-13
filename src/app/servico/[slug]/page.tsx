import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasesSection } from "@/components/cases/CasesSection";
import { RelatedServices } from "@/components/services/RelatedServices";
import { ServiceDetails } from "@/components/services/ServiceDetails";
import { ServiceHero } from "@/components/services/ServiceHero";
import { CtaBanner } from "@/components/shared/CtaBanner";
import { getCasesByIds, getService, getServices, type Service } from "@/lib/cms/wordpress";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servico/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.seo.title ?? `${service.title} | agência ili`,
    description: service.seo.description,
  };
}

export default async function ServicePage({ params }: PageProps<"/servico/[slug]">) {
  // Lido fora de <Suspense> de propósito: assim um slug inexistente responde 404 de verdade
  // (dentro do Suspense o status 200 já teria sido enviado).
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const [cases, services] = await Promise.all([getCasesByIds(service.caseIds), getServices()]);
  const related = service.relatedIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is Service => s !== undefined);

  return (
    <>
      <ServiceHero service={service} />
      <ServiceDetails service={service} />
      {cases.length > 0 && <CasesSection cases={cases} variant="service" />}
      <RelatedServices service={service} related={related} />
      <CtaBanner
        label="nem sempre a solução é separada"
        title={
          service.ctaTitleHtml !== "" ? (
            { html: service.ctaTitleHtml }
          ) : (
            <>
              às vezes o problema não é só tecnologia — é{" "}
              <span className="text-accent">estratégia, marca e execução juntas.</span>
            </>
          )
        }
        description={
          service.ctaSubtitleHtml !== ""
            ? { html: service.ctaSubtitleHtml }
            : "receba um diagnóstico gratuito e descubra exatamente o que sua empresa precisa para crescer. sem achismo, sem compromisso — só clareza."
        }
      />
    </>
  );
}
