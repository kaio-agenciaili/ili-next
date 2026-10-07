"use client";

import { useEffect, type RefObject } from "react";

/**
 * Acende (`.lit`) os itens que estão na área central da tela e apaga os que saem.
 * Usado na lista de dores e na timeline de serviços.
 * `onChange` deve ser estável (ex.: `useCallback`).
 */
export function useLitOnScroll(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  onChange?: () => void,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("lit", entry.isIntersecting);
        }
        onChange?.();
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" },
    );
    container.querySelectorAll(selector).forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [containerRef, selector, onChange]);
}
