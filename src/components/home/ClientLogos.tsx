import Image from "next/image";
import { DraggableMarquee } from "@/components/effects/DraggableMarquee";
import { Reveal } from "@/components/effects/Reveal";

/** [arquivo em /img/clientes, nome, largura, altura] — mesmas logos da página Quem Somos. */
const logos: [string, string, number, number][] = [
  ["globalpayments", "Global Payments", 202, 120],
  ["grupo-card", "Grupo Card", 202, 119],
  ["gts", "GTS", 144, 85],
  ["ibm", "IBM", 144, 85],
  ["massax", "Massax", 144, 85],
  ["mediastream", "Mediastream", 144, 85],
  ["nottus", "Nottus", 144, 85],
  ["praja", "Praja", 144, 85],
  ["rappi", "Rappi", 144, 85],
  ["rme", "RME", 144, 85],
  ["roomo-atlantica", "Roomo Atlantica", 202, 120],
  ["rs-servicos", "RS Serviços", 202, 120],
  ["a-fabrica", "A-fábrica", 144, 85],
  ["atlantica", "Atlantica", 144, 85],
  ["banijay", "Banijay", 144, 85],
  ["baruel", "Baruel", 144, 85],
  ["cardpay", "CardPay", 144, 85],
  ["cartoon", "Cartoon", 144, 85],
  ["ckz", "CKZ", 144, 85],
  ["datalogic", "Datalogic", 144, 85],
  ["dentallis", "Dentallis", 144, 85],
  ["dot", "Dot", 144, 85],
  ["dr-jairo-bouer", "Dr. Jairo Bouer", 144, 85],
  ["elaw", "Elaw", 144, 85],
  ["ellan", "ellan", 144, 85],
  ["endemolshine", "EndemolShine Brasil", 202, 120],
  ["gladermar", "Glademar", 144, 85],
  ["intex", "Intex", 144, 85],
  ["oncocard", "OncoCard", 144, 85],
  ["refazer", "Refazer", 144, 85],
  ["roomo-transamerica", "Roomo Transamerica", 144, 85],
  ["safra", "Safra", 144, 85],
  ["sem-parar", "Sem Parar", 144, 85],
  ["sicredi", "Sicredi", 144, 85],
  ["smartset", "Smartset", 144, 85],
  ["stone", "Stone", 144, 85],
  ["storm", "Storm", 144, 85],
  ["verso", "Verso", 144, 85],
  ["visa", "Visa", 144, 85],
  ["vitaderm", "VitaDerm", 144, 85],
  ["wibbifit", "Wibbit", 144, 85],
  ["yalo", "Yalo", 144, 85],
];

export function ClientLogos() {
  return (
    <section className="section-ili">
      <div className="container-ili">
        <Reveal as="p" className="svc-hero-heading ili-clientes-heading mb-6 text-center">
          mais de 400 empresas já confiaram na visão e na entrega da ili
        </Reveal>
        {/* A lista vai duplicada para o loop infinito do marquee. */}
        <DraggableMarquee reveal className="logo-marquee-wrapper" trackClassName="logo-marquee-track">
          {[...logos, ...logos].map(([file, name, width, height], i) => (
            <Image key={`${file}-${i}`} src={`/img/clientes/${file}.png`} alt={name} width={width} height={height} />
          ))}
        </DraggableMarquee>
      </div>
    </section>
  );
}
