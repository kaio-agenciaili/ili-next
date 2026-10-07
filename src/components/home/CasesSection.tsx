import { Reveal } from "@/components/effects/Reveal";
import { getHomeCases } from "@/lib/cms/wordpress";
import { CasesCarousel } from "./CasesCarousel";

export async function CasesSection() {
  const cases = await getHomeCases();

  return (
    <section id="cases" className="cases-carousel-section">
      <div className="container-ili relative z-1">
        <Reveal className="cases-carousel-header cases-carousel-header--center pb-[60px] sm:pb-[80px]">
          <div>
            <span className="cases-label">cases</span>
            <h2>onde a estratégia encontra o resultado.</h2>
          </div>
        </Reveal>

        <CasesCarousel cases={cases} />
      </div>
    </section>
  );
}
