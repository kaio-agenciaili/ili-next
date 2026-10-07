"use client";

import { useRef } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { useLitOnScroll } from "@/components/effects/use-lit-on-scroll";

const pains = [
  "posicionamento que não acompanha o nível que o negócio já atingiu",
  "investimento em marketing crescendo, mas o retorno ainda é difícil de explicar",
  "decisões tomadas no achismo porque os dados não estão organizados para orientar",
];

export function Pains() {
  const listRef = useRef<HTMLDivElement>(null);
  useLitOnScroll(listRef, ".dor-glow");

  return (
    <section id="dores" className="section-ili">
      <div className="container-ili relative z-1">
        <Reveal className="dores-row grid items-start gap-12 lg:grid-cols-2">
          <div className="dores-title-col">
            <h2 className="section-heading text-grad dores-title">
              você já passou <br />
              <span className="text-accent">por isso:</span>
            </h2>
          </div>
          <div>
            <div ref={listRef} className="dores-list">
              {pains.map((text, i) => (
                <div key={text} className="dor-item dor-glow">
                  <span className="dor-num">{String(i + 1).padStart(2, "0")}</span>
                  <p className="dor-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
