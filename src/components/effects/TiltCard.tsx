"use client";

import type { MouseEvent, ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Card com inclinação 3D acompanhando o cursor (`.card-tilt`). */
export function TiltCard({ className, children }: { className?: string; children: ReactNode }) {
  function onMove(e: MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -6;
    const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  function onLeave(e: MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  }

  return (
    <div className={cx(className, "card-tilt")} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
