"use client";

import { useRef, type HTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { useInViewOnce } from "./use-in-view-once";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "p";
  /** Entrada em cascata dos filhos diretos (`.reveal-cascade`). */
  cascade?: boolean;
};

/** Aparece suavemente ao entrar na tela (`.reveal` → `.reveal.visible`). */
export function Reveal({ as: Tag = "div", cascade, className, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLParagraphElement>(null);
  const visible = useInViewOnce(ref);

  return (
    <Tag
      ref={ref}
      className={cx(className, cascade && "reveal-cascade", "reveal", visible && "visible")}
      {...rest}
    />
  );
}
