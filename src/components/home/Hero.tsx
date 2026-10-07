import { MagneticLink, MagneticSpan } from "@/components/effects/magnetic";
import { routes } from "@/lib/site";

export function Hero() {
  return (
    <section id="hero" className="hero-ili-bg relative overflow-hidden">
      <div className="container-ili relative z-10">
        <div className="hero-home-row grid items-center gap-x-6 lg:grid-cols-12">
          <div className="hidden justify-center lg:col-span-5 lg:flex" aria-hidden="true" />
          <div className="mb-12 text-center lg:col-span-7 lg:mb-0 lg:text-left">
            <div className="hero-animate hero-animate-delay-1 mb-6 flex justify-start">
              <MagneticSpan className="pill-status">parceria que pensa e executa junto com você</MagneticSpan>
            </div>

            <h1 className="hero-text text-grad text-shimmer hero-animate hero-animate-delay-2 mb-6 max-sm:text-left">
              estratégia, redes sociais, performance e design para marcas que querem{" "}
              <span className="text-accent">crescer.</span>
            </h1>

            <p className="section-subheading hero-animate hero-animate-delay-3 mx-auto mb-12 max-w-[520px] max-sm:text-left lg:mx-0">
              conectamos visão de negócio, dados e execução para transformar marketing em resultados reais.
            </p>

            <div className="hero-animate hero-animate-delay-4 flex flex-wrap items-center justify-center gap-4 max-sm:justify-start lg:justify-start">
              <MagneticLink href={routes.diagnostico} className="btn-ili btn-lg">
                quero conversar sobre meu negócio
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
