"use client";

import { useEffect, useState, type RefObject } from "react";

/** Vira `true` na primeira vez que o elemento entra na viewport (scroll reveal do tema). */
export function useInViewOnce(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
