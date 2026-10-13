"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { cx } from "@/lib/cx";

export type Quote = {
  text: string;
  name: string;
  photo: string;
  role: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Depoimentos da página de cases: troca com fade e a altura acompanha o depoimento ativo. */
export function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updateHeight = () => {
      const active = slideRefs.current[current];
      const track = trackRef.current;
      if (active && track && active.offsetHeight > 0) track.style.height = `${active.offsetHeight}px`;
    };
    const frame = requestAnimationFrame(updateHeight);
    window.addEventListener("resize", updateHeight);
    window.addEventListener("load", updateHeight);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("load", updateHeight);
    };
  }, [current]);

  const show = (index: number) => setCurrent(((index % quotes.length) + quotes.length) % quotes.length);

  return (
    <div className="csb-quote-split csb-quote-split--carousel">
      <div className="csb-quote-label">
        <h2>
          depoimento <br />
          do cliente
        </h2>
        <Reveal className="cases-nav csb-quote-nav" aria-label="Navegação do carrossel de depoimentos">
          <button type="button" className="cases-nav-btn" aria-label="Anterior" onClick={() => show(current - 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="cases-counter">
            <span>{pad(current + 1)}</span> / <span>{pad(quotes.length)}</span>
          </span>
          <button type="button" className="cases-nav-btn" aria-label="Próximo" onClick={() => show(current + 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </Reveal>
      </div>

      <div className="csb-quote-carousel" aria-roledescription="carousel" aria-label="Depoimentos">
        <div ref={trackRef} className="csb-quote-track">
          {quotes.map((quote, i) => (
            <div
              key={quote.name}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={cx("quote-slide", i === current && "quote-slide--active")}
              data-index={i}
            >
              <blockquote>
                <p>{quote.text}</p>
                <footer className="csb-quote-author">
                  <Image src={quote.photo} alt={quote.name} width={40} height={40} />
                  <div className="csb-quote-author-line">
                    <strong>{quote.name}</strong>
                    <span className="csb-quote-sep" aria-hidden="true">
                      {"  "}
                    </span>
                    <span>{quote.role}</span>
                  </div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
