"use client";

import Link from "next/link";
import { useRef, type ComponentProps, type HTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { useInViewOnce } from "./use-in-view-once";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "p" | "h1" | "h2" | "section";
  /** Entrada em cascata dos filhos diretos (`.reveal-cascade`). */
  cascade?: boolean;
};

/** Aparece suavemente ao entrar na tela (`.reveal` → `.reveal.visible`). */
export function Reveal({ as: Tag = "div", cascade, className, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLParagraphElement & HTMLHeadingElement>(null);
  const visible = useInViewOnce(ref);

  return (
    <Tag
      ref={ref}
      className={cx(className, cascade && "reveal-cascade", "reveal", visible && "visible")}
      {...rest}
    />
  );
}

/** Link interno com o mesmo scroll reveal (ex.: cards `<a class="cf-card reveal">`). */
export function RevealLink({ className, ...rest }: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const visible = useInViewOnce(ref);

  return <Link ref={ref} className={cx(className, "reveal", visible && "visible")} {...rest} />;
}
