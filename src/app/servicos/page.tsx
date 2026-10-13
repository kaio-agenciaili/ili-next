import type { Metadata } from "next";
import { MagneticLink } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CtaBanner } from "@/components/shared/CtaBanner";
import { getPageSeo, getServices } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("servicos");
  return { title: seo.title ?? "serviços | agência ili", description: seo.description };
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="qs-hero hero-cases relative overflow-hidden bg-[url(/img/bg-cases.png)]">
        <div className="container-ili relative z-1">
          <div className="grid items-center gap-x-6 lg:grid-cols-12">
            <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
            <div className="mb-12 lg:col-span-7 lg:mb-0">
              <Reveal as="h1" className="qs-hero-title">
                o que entregamos para <br />
                acelerar o seu <span className="text-accent">crescimento</span>
              </Reveal>
              <Reveal as="p" className="qs-hero-desc">
                cada serviço é pensado para resolver um problema real do seu negócio. da estratégia de marca à performance
                digital, tudo integrado, orientado por dados e focado em resultado.
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

      <section className="cf-services">
        <div className="container-ili">
          <div className="cf-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title={
          <>
            quer entender como isso se aplica ao <span className="text-accent">seu negócio?</span>
          </>
        }
        description={
          <>
            o diagnóstico é gratuito e direto. em uma conversa, você já sai com <br />
            um panorama real do seu marketing.
          </>
        }
      />
    </>
  );
}
