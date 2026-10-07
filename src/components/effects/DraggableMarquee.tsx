"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useInViewOnce } from "./use-in-view-once";

function getTranslateX(el: HTMLElement): number {
  const t = window.getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  const m = t.match(/^matrix\((.+)\)$/);
  if (m) {
    const parts = m[1].split(",").map((v) => parseFloat(v.trim()));
    return Number.isFinite(parts[4]) ? parts[4] : 0;
  }
  const m3 = t.match(/^matrix3d\((.+)\)$/);
  if (m3) {
    const parts = m3[1].split(",").map((v) => parseFloat(v.trim()));
    return Number.isFinite(parts[12]) ? parts[12] : 0;
  }
  return 0;
}

function parseSeconds(value: string): number {
  const first = String(value || "").split(",")[0].trim();
  const n = parseFloat(first);
  if (!Number.isFinite(n)) return 0;
  return first.endsWith("ms") ? n / 1000 : n;
}

type DraggableMarqueeProps = {
  className: string;
  trackClassName: string;
  /** Aplica o scroll reveal no próprio wrapper. */
  reveal?: boolean;
  children: ReactNode;
};

/**
 * Faixa com animação CSS infinita que também pode ser arrastada.
 * Ao soltar, a animação continua a partir do ponto onde parou.
 */
export function DraggableMarquee({ className, trackClassName, reveal, children }: DraggableMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visible = useInViewOnce(wrapperRef);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    let isDown = false;
    let startX = 0;
    let baseX = 0;
    let currentX = 0;
    let pointerId: number | null = null;
    const durationSec = parseSeconds(window.getComputedStyle(track).animationDuration);

    const end = () => {
      if (!isDown) return;
      isDown = false;
      wrapper.classList.remove("is-dragging");

      const half = track.scrollWidth ? track.scrollWidth / 2 : 0;
      let progress = 0;
      if (half > 0) {
        let x = currentX % half;
        if (x > 0) x -= half;
        progress = -x / half;
      }

      track.style.willChange = "";
      track.style.transform = "";
      track.style.animation = "";
      track.style.animationDelay = durationSec > 0 ? `-${progress * durationSec}s` : "";
      track.style.animationPlayState = "running";
      pointerId = null;
    };

    const onDown = (e: PointerEvent) => {
      // Só o botão principal; evita conflito com o scroll vertical.
      if (e.button !== 0) return;
      e.preventDefault();
      isDown = true;
      pointerId = e.pointerId;
      wrapper.classList.add("is-dragging");
      wrapper.setPointerCapture?.(e.pointerId);
      startX = e.clientX;
      baseX = getTranslateX(track);
      currentX = baseX;
      // Congela no ponto atual e passa a controlar manualmente.
      track.style.animationPlayState = "paused";
      track.style.animation = "none";
      track.style.willChange = "transform";
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown || (pointerId !== null && e.pointerId !== pointerId)) return;
      e.preventDefault();
      currentX = baseX + (e.clientX - startX);
      track.style.transform = `translateX(${currentX}px)`;
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId !== null && e.pointerId !== pointerId) return;
      end();
    };

    wrapper.addEventListener("pointerdown", onDown);
    wrapper.addEventListener("pointermove", onMove, { passive: false });
    wrapper.addEventListener("pointerup", onUp);
    wrapper.addEventListener("pointercancel", onUp);
    wrapper.addEventListener("pointerleave", end);
    return () => {
      wrapper.removeEventListener("pointerdown", onDown);
      wrapper.removeEventListener("pointermove", onMove);
      wrapper.removeEventListener("pointerup", onUp);
      wrapper.removeEventListener("pointercancel", onUp);
      wrapper.removeEventListener("pointerleave", end);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cx(className, reveal && "reveal", reveal && visible && "visible")}>
      <div ref={trackRef} className={trackClassName}>
        {children}
      </div>
    </div>
  );
}
