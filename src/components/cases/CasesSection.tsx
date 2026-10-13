import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import type { CaseSlide } from "@/lib/cms/wordpress";
import { routes } from "@/lib/site";
import { CasesCarousel } from "./CasesCarousel";

type CasesSectionProps = {
  cases: CaseSlide[];
  variant?: "home" | "service";
};

/** Seção “onde a estratégia encontra o resultado” com o carrossel de cases. */
export function CasesSection({ cases, variant = "home" }: CasesSectionProps) {
  return (
    <section id="cases" className="cases-carousel-section">
      <div className="container-ili relative z-1">
        <Reveal className="cases-carousel-header cases-carousel-header--center pb-[60px] sm:pb-[80px]">
          <div>
            <span className="cases-label">cases</span>
            <h2>onde a estratégia encontra o resultado.</h2>
          </div>
        </Reveal>

        <CasesCarousel cases={cases} variant={variant} />

        {variant === "service" && (
          <Reveal className="mt-12 text-center">
            <Link href={routes.cases} className="btn-cases-more">
              ver todos os cases <span>&rarr;</span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
