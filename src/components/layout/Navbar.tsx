"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MagneticLink } from "@/components/effects/magnetic";
import { cx } from "@/lib/cx";
import { routes, site } from "@/lib/site";

const links = [
  { href: routes.quemSomos, label: "quem somos" },
  // { href: routes.cases, label: "cases" }, — oculto no site atual
  { href: routes.servicos, label: "serviços" },
  { href: routes.contato, label: "contato" },
];

/** Duração da transição de saída do painel (mesma do CSS). */
const CLOSE_MS = 420;

type MenuState = "closed" | "open" | "closing";

export function Navbar() {
  const [menu, setMenu] = useState<MenuState>("closed");
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function openMenu() {
    clearTimeout(closeTimer.current);
    setMenu("open");
  }

  function closeMenu() {
    if (menu !== "open" || window.innerWidth > 991) return;
    setMenu("closing");
    closeTimer.current = setTimeout(() => setMenu("closed"), CLOSE_MS);
  }

  // Trava o scroll da página com o menu mobile aberto.
  useEffect(() => {
    const lock = menu !== "closed" && window.innerWidth <= 991;
    document.body.classList.toggle("menu-open-mobile", lock);
  }, [menu]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 991) document.body.classList.remove("menu-open-mobile");
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <nav className="navbar-ili">
      <div className="container-ili">
        <Link className="navbar-brand flex items-center gap-1" href={routes.home}>
          <Image src="/img/logo-ili.svg" alt={site.name} width={106} height={27} className="h-[28px] w-auto" priority />
        </Link>

        <button
          className="navbar-toggler ili-menu-toggler"
          type="button"
          aria-controls="navMain"
          aria-expanded={menu === "open"}
          aria-label="Menu"
          onClick={() => (menu === "open" ? closeMenu() : openMenu())}
        >
          <span className="navbar-toggler-icon" aria-hidden="true" />
        </button>

        <div
          id="navMain"
          className={cx(
            "navbar-collapse mobile-menu-panel justify-center",
            menu === "open" && "show",
            menu === "closing" && "menu-is-closing",
          )}
        >
          <div className="nav-pill-glass mx-auto hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link key={link.href} className="nav-link" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <ul className="navbar-nav mobile-menu-block mobile-menu-block--nav lg:hidden">
            {links.map((link) => (
              <li key={link.href} className="nav-item">
                <Link className="nav-link" href={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-menu-cta mobile-menu-block mobile-menu-block--cta lg:hidden">
            <MagneticLink href={routes.diagnostico} className="btn-ili btn-lg w-full">
              quero um diagnóstico
            </MagneticLink>
          </div>

          <div className="mobile-menu-block mobile-menu-block--connect lg:hidden" aria-label="Redes e contato">
            <div className="mobile-menu-social contact-social" aria-label="Redes sociais">
              <a href={site.instagram} className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href={site.linkedin} className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
            <div className="mobile-menu-contact">
              <a href={`mailto:${site.email}`} className="mobile-contact-link">
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <Link href={routes.diagnostico} className="btn-ili">
            quero um diagnóstico
          </Link>
        </div>
      </div>
    </nav>
  );
}
