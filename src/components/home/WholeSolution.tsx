import { MagneticLink } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/Reveal";
import { routes } from "@/lib/site";

export function WholeSolution() {
  return (
    <section className="section-ili">
      <div className="container-ili relative z-1">
        <Reveal className="grid gap-x-6 lg:grid-cols-12">
          <div className="text-center max-sm:text-left lg:col-span-8 lg:col-start-3">
            <h2 className="section-heading text-grad mb-6 max-sm:text-left">
              a maioria das agências resolve partes
              <br />
              <span className="text-accent">a ili resolve o todo</span>
            </h2>
            <p className="section-subheading mx-auto mb-4 max-w-[600px]">
              estratégia, execução e proximidade real, trabalhando juntas para <br className="max-sm:hidden" />
              gerar resultado que aparece no negócio.
            </p>

            <MagneticLink href={routes.diagnostico} className="btn-ili btn-lg">
              quero entender como isso se aplica ao meu negócio
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
