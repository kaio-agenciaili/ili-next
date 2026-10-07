import type { Metadata } from "next";
import { Funnel_Display, Trirong } from "next/font/google";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { allowIndexing } from "@/lib/site";
import "./globals.css";

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin", "latin-ext"],
});

const trirong = Trirong({
  variable: "--font-trirong",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "agência ili | estratégia, marketing e performance",
  description:
    "Conectamos visão de negócio, dados e execução para transformar marketing em resultado real. Branding, mídia paga, conteúdo, design e tecnologia.",
  robots: allowIndexing ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${funnelDisplay.variable} ${trirong.variable}`} data-scroll-behavior="smooth">
      <body id="topo">
        <Navbar />

        {/* Gradiente usado em ícones (stroke: url(#grad-icon)) */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(238,134,86,1)" />
              <stop offset="41%" stopColor="rgba(217,69,124,1)" />
              <stop offset="100%" stopColor="rgba(210,48,137,1)" />
            </linearGradient>
          </defs>
        </svg>

        <CursorGlow />

        {children}

        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
