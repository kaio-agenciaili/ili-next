"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Efeito “magnético”: o elemento acompanha levemente o cursor. */
function onMagneticMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
}

function onMagneticLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = "translate(0, 0)";
}

type MagneticLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function MagneticLink({ href, className, children }: MagneticLinkProps) {
  return (
    <Link
      href={href}
      className={cx(className, "btn-magnetic")}
      onMouseMove={onMagneticMove}
      onMouseLeave={onMagneticLeave}
    >
      {children}
    </Link>
  );
}

export function MagneticSpan({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cx(className, "btn-magnetic")} onMouseMove={onMagneticMove} onMouseLeave={onMagneticLeave}>
      {children}
    </span>
  );
}
