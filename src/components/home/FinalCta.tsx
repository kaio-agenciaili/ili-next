import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import { routes } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="cta" className="section-ili cta-section py-[7rem]">
      <div className="container-ili relative z-10">
        <div className="grid gap-x-6 lg:grid-cols-12">
          <Reveal className="text-center max-sm:text-left lg:col-span-8 lg:col-start-3">
            <h2 className="hero-text text-grad mb-6">vamos falar sobre o próximo passo do seu negócio?</h2>
            <p className="section-subheading mx-auto mb-12 max-w-[500px]">
              se você busca uma parceria que questiona, constrói e executa com você, o lugar é aqui.
            </p>
            <Link href={routes.diagnostico} className="btn-ili btn-lg px-10 py-[0.875rem] text-[1.0625rem]">
              quero conversar
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
