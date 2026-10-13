import Image from "next/image";
import { DraggableMarquee } from "@/components/effects/DraggableMarquee";
import { Reveal } from "@/components/effects/Reveal";
import { clientLogos } from "@/lib/clients";

export function ClientLogos() {
  return (
    <section className="section-ili">
      <div className="container-ili">
        <Reveal as="p" className="svc-hero-heading ili-clientes-heading mb-6 text-center">
          mais de 400 empresas já confiaram na visão e na entrega da ili
        </Reveal>
        {/* A lista vai duplicada para o loop infinito do marquee. */}
        <DraggableMarquee reveal className="logo-marquee-wrapper" trackClassName="logo-marquee-track">
          {[...clientLogos, ...clientLogos].map((logo, i) => (
            <Image
              key={`${logo.file}-${i}`}
              src={`/img/clientes/${logo.file}.png`}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
            />
          ))}
        </DraggableMarquee>
      </div>
    </section>
  );
}
