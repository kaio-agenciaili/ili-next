import Image from "next/image";
import { DraggableMarquee } from "@/components/effects/DraggableMarquee";
import { Reveal } from "@/components/effects/Reveal";
import { cx } from "@/lib/cx";

const numbers = [
  { value: "+15", label: "anos" },
  { value: "+1.000", label: "projetos" },
  { value: "+40", label: "setores atendidos" },
];

// width/height = tamanho real do arquivo: no mobile é ele que define a largura do card.
const leads = [
  { photo: "anderson.jpg", width: 1456, height: 720, name: "Anderson", role: "fundador & sócio-diretor", large: true },
  { photo: "luana.png", width: 928, height: 1120, name: "Luana", role: "gestão de projetos" },
  { photo: "marcela.png", width: 960, height: 1088, name: "Marcela", role: "head de conteúdo" },
  { photo: "guima.png", width: 960, height: 1088, name: "Guima", role: "head de design" },
  { photo: "kaio.png", width: 960, height: 1088, name: "Kaio", role: "head de desenvolvimento" },
];

const members = [
  { photo: "avatar-valesca.png", name: "Valesca Carvalho", role: "gerente de contas" },
  { photo: "avatar-douglas.png", name: "Douglas Alves", role: "motion designer" },
  { photo: "avatar-ju.png", name: "Julia Paiva", role: "designer" },
  { photo: "avatar-lucas.png", name: "Lucas Marques", role: "motion designer" },
  { photo: "avatar-thay.png", name: "Taynná Arruda", role: "analista de conteúdo" },
  { photo: "avatar-luiza.png", name: "Luiza Barth", role: "analista de conteúdo" },
  { photo: "avatar-eloisa.png", name: "Eloisa Bonfim", role: "analista de conteúdo" },
  { photo: "avatar-amanda.png", name: "Amanda Tambara", role: "analista de conteúdo" },
  { photo: "avatar-jed.png", name: "Jedson Santos", role: "desenvolvedor" },
];

export function Team() {
  return (
    <section id="time" className="section-ili">
      <div className="container-ili relative z-1">
        <Reveal className="mb-12 text-center max-sm:text-left">
          <div className="big-numbers mb-6">
            {numbers.map((n) => (
              <div key={n.label} className="big-number-item">
                <span className="big-number-value">{n.value}</span>
                <span className="big-number-label">{n.label}</span>
              </div>
            ))}
          </div>
          <p className="section-subheading mx-auto mt-4 max-w-[580px]">
            nosso time atua como uma extensão do seu. cada decisão passa pelo crivo de quem entende de mercado e marca.
          </p>
        </Reveal>

        <Reveal className="team-faces">
          {leads.map((person) => (
            <div key={person.name} className={cx("team-face", person.large && "team-face-lg")}>
              <div className="team-face-photo">
                <Image
                  src={`/img/time/${person.photo}`}
                  alt={person.name}
                  width={person.width}
                  height={person.height}
                  sizes={person.large ? "(max-width: 575px) 100vw, 280px" : "(max-width: 575px) 50vw, 180px"}
                />
                <span className="team-face-role">{person.role}</span>
              </div>
              <span className="team-face-name">{person.name}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="team-marquee-wrapper mt-12">
          {/* A lista vai duplicada para o loop infinito do marquee. */}
          <DraggableMarquee className="team-marquee team-marquee-left" trackClassName="team-marquee-track">
            {[...members, ...members].map((m, i) => (
              <div key={`${m.photo}-${i}`} className="team-pill">
                <Image src={`/img/time/${m.photo}`} alt={m.name} width={40} height={40} />
                <span className="team-pill-name">{m.name}</span>
                <span className="team-pill-role">{m.role}</span>
              </div>
            ))}
          </DraggableMarquee>
        </Reveal>
      </div>
    </section>
  );
}
