"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useLitOnScroll } from "./use-lit-on-scroll";

/**
 * Timeline vertical (`.svc-right`): os `.svc-card` filhos acendem conforme o scroll
 * e a linha gradiente cresce até o último card aceso.
 */
export function Timeline({ children }: { children: ReactNode }) {
  const rightRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const updateFill = useCallback(() => {
    const right = rightRef.current;
    const fill = fillRef.current;
    const line = lineRef.current;
    if (!right || !fill) return;

    const allCards = Array.from(right.querySelectorAll<HTMLElement>(".svc-card"));
    const litCards = Array.from(right.querySelectorAll<HTMLElement>(".svc-card.lit"));
    if (litCards.length === 0) {
      fill.style.height = "0px";
      return;
    }

    const lastLit = litCards[litCards.length - 1];
    // Última etapa: preenche até o fim da trilha, não só até o centro do dot.
    if (lastLit === allCards[allCards.length - 1] && line) {
      fill.style.height = `${Math.max(0, line.offsetHeight)}px`;
      return;
    }

    const dot = lastLit.querySelector<HTMLElement>(".timeline-dot");
    if (!dot) return;

    // offsetTop acumulado em relação ao container (independe do scroll).
    let top = 0;
    let el: HTMLElement | null = dot;
    while (el && el !== right) {
      top += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    fill.style.height = `${Math.max(0, top + dot.offsetHeight / 2)}px`;
  }, []);

  useLitOnScroll(rightRef, ".svc-card", updateFill);

  useEffect(() => {
    window.addEventListener("scroll", updateFill, { passive: true });
    return () => window.removeEventListener("scroll", updateFill);
  }, [updateFill]);

  return (
    <div ref={rightRef} className="svc-right">
      <div ref={lineRef} className="timeline-line" />
      <div ref={fillRef} className="timeline-line-fill" />
      {children}
    </div>
  );
}
