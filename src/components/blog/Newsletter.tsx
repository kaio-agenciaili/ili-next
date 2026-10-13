"use client";

import { Reveal } from "@/components/effects/Reveal";

/**
 * Bloco de newsletter do blog.
 * Igual ao tema: o formulário ainda não envia para lugar nenhum (lá era `onsubmit="return false"`).
 */
export function Newsletter({ reveal = false }: { reveal?: boolean }) {
  const content = (
    <div className="container-ili">
      <div className="blog-newsletter-card">
        <h2 className="section-heading text-grad">receba conteúdo que faz diferença.</h2>
        <p className="section-subheading mt-2 mb-6 max-w-[480px]">
          insights sobre estratégia, marca e crescimento direto no seu e-mail. sem spam, só valor.
        </p>
        <form className="blog-newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="seu melhor e-mail" className="blog-newsletter-input" required />
          <button type="submit" className="btn-ili">
            quero receber
          </button>
        </form>
      </div>
    </div>
  );

  return reveal ? (
    <Reveal as="section" className="blog-newsletter">
      {content}
    </Reveal>
  ) : (
    <section className="blog-newsletter">{content}</section>
  );
}
