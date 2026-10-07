"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/effects/Reveal";
import type { HomeCase } from "@/lib/cms/wordpress";
import { cx } from "@/lib/cx";

const pad = (n: number) => String(n).padStart(2, "0");

/** Duração da troca de slide (mesma transição do CSS + folga). */
const SWITCH_MS = 650;

function StatArrow() {
  return (
    <svg className="case-stat-arrow" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M1.31818 11.1851L11.0882 1.41513M3.40692 1.31817L11.2121 1.33455L11.1851 9.09631"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="2.63636"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaseSlide({ item }: { item: HomeCase }) {
  const { testimonial, summary } = item;
  const showBubble = testimonial !== null || summary !== "";

  return (
    <div className="cases-slide-split">
      <div className="cases-slide-left">
        <h3>{item.title}</h3>

        {item.stats.length > 0 ? (
          <ul className="case-stats">
            {item.stats.map((stat, i) => (
              <li key={i}>
                <StatArrow />
                {stat.numero !== "" && <strong>{stat.numero}</strong>}
                {stat.descricao !== "" && <span className="case-stat-text">{stat.descricao}</span>}
              </li>
            ))}
          </ul>
        ) : item.tags.length > 0 ? (
          <ul className="case-stats case-stats--tags">
            {item.tags.map((tag) => (
              <li key={tag}>
                <StatArrow />
                <strong>{tag}</strong>
              </li>
            ))}
          </ul>
        ) : null}

        {showBubble && (
          <div className="cases-testimonial-bubble" aria-label={testimonial ? "Depoimento do cliente" : "Resumo do case"}>
            {testimonial?.html ? (
              // Texto do depoimento vem do CMS e pode ter formatação simples.
              <p dangerouslySetInnerHTML={{ __html: testimonial.html }} />
            ) : !testimonial && summary !== "" ? (
              <p>{summary}</p>
            ) : null}

            {testimonial && (
              <div className="cases-testimonial-person">
                {testimonial.photo && (
                  <Image
                    className="cases-testimonial-avatar"
                    src={testimonial.photo.url}
                    alt={testimonial.name || item.title}
                    width={testimonial.photo.width}
                    height={testimonial.photo.height}
                    sizes="72px"
                  />
                )}
                {testimonial.name && <span className="cases-testimonial-name block">{testimonial.name}</span>}
                {testimonial.role && <span className="cases-testimonial-role block">{testimonial.role}</span>}
                {testimonial.company && <span className="cases-testimonial-company block">{testimonial.company}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="cases-slide-right">
        <div className="cases-slide-main">
          <div className="case-v2-img">
            {item.banner && (
              <Image
                src={item.banner.url}
                alt={item.title}
                width={item.banner.width}
                height={item.banner.height}
                sizes="(max-width: 991px) 100vw, 640px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CasesCarousel({ cases }: { cases: HomeCase[] }) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const current = useRef(0);
  const switching = useRef(false);
  const [currentNum, setCurrentNum] = useState(1);

  /** Mesma animação do tema: o slide atual sai por um lado e o próximo entra pelo outro. */
  function showSlide(index: number, direction: "left" | "right") {
    const slides = slideRefs.current;
    if (switching.current || slides.length === 0) return;
    const next = (index + slides.length) % slides.length;
    if (next === current.current) return;
    const outSlide = slides[current.current];
    const inSlide = slides[next];
    if (!outSlide || !inSlide) return;
    switching.current = true;

    inSlide.classList.remove("cases-slide--exit-left", "cases-slide--exit-right", "cases-slide--enter-left", "cases-slide--enter-right");
    inSlide.style.transition = "none";
    inSlide.classList.add(direction === "right" ? "cases-slide--enter-right" : "cases-slide--enter-left");
    inSlide.style.display = "flex";
    inSlide.style.position = "absolute";

    void inSlide.offsetWidth; // força o reflow antes de animar

    inSlide.style.transition = "";
    outSlide.classList.add(direction === "right" ? "cases-slide--exit-left" : "cases-slide--exit-right");
    outSlide.classList.remove("cases-slide--active");
    inSlide.classList.remove("cases-slide--enter-right", "cases-slide--enter-left");
    inSlide.classList.add("cases-slide--active");
    inSlide.style.position = "";

    setTimeout(() => {
      outSlide.style.display = "";
      outSlide.classList.remove("cases-slide--exit-left", "cases-slide--exit-right");
      current.current = next;
      setCurrentNum(next + 1);
      switching.current = false;
    }, SWITCH_MS);
  }

  return (
    <>
      <Reveal className="cases-nav cases-nav--bottom-right" aria-label="Navegação do carrossel de cases">
        <button type="button" className="cases-nav-btn" aria-label="Anterior" onClick={() => showSlide(current.current - 1, "left")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="cases-counter">
          <span>{pad(currentNum)}</span> / <span>{cases.length > 0 ? pad(cases.length) : "00"}</span>
        </span>
        <button type="button" className="cases-nav-btn" aria-label="Próximo" onClick={() => showSlide(current.current + 1, "right")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </Reveal>

      <div className="cases-carousel-track">
        {cases.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={cx("cases-slide", i === 0 && "cases-slide--active")}
            data-index={i}
          >
            <CaseSlide item={item} />
          </div>
        ))}
      </div>
    </>
  );
}
