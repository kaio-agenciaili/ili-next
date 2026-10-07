"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useLitOnScroll } from "@/components/effects/use-lit-on-scroll";

export type TimelineItem = { title: string; desc: string; href: string };

/** Cards de serviço em timeline vertical: acendem e preenchem a linha conforme o scroll. */
export function ServicesTimeline({ items }: { items: TimelineItem[] }) {
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

      {items.map((item, i) => (
        <div key={item.title} className="svc-card noise-overlay">
          <div className="timeline-dot" />
          <div className="svc-card-content">
            <span className="svc-card-num">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="svc-card-title">{item.title}</h4>
            <p className="svc-card-desc">{item.desc}</p>
            <Link href={item.href} className="svc-card-btn">
              conhecer serviço
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
