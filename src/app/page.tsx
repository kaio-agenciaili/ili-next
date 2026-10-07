import { CasesSection } from "@/components/home/CasesSection";
import { ClientLogos } from "@/components/home/ClientLogos";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Method } from "@/components/home/Method";
import { Pains } from "@/components/home/Pains";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ServiceShortcuts } from "@/components/home/ServiceShortcuts";
import { Team } from "@/components/home/Team";
import { WholeSolution } from "@/components/home/WholeSolution";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceShortcuts />
      <ClientLogos />
      <Pains />
      <WholeSolution />
      <CasesSection />
      <ServicesSection />
      <Method />
      <Team />
      <FinalCta />
    </>
  );
}
