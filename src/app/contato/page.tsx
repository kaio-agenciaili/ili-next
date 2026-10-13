import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/effects/Reveal";
import { getCf7Config, getPageSeo } from "@/lib/cms/wordpress";
import { cf7Forms, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contato");
  return { title: seo.title ?? "contato | agência ili", description: seo.description };
}

const channels = {
  whatsapp: "https://wa.me/5511976237862",
  instagram: "https://www.instagram.com/agenciaili/",
  linkedin: "https://www.linkedin.com/company/agenciaili/",
};

export default async function ContactPage() {
  const cf7 = await getCf7Config(cf7Forms.contato.formId, cf7Forms.contato.pageSlug);

  return (
    <section className="contact-split">
      <div className="container-ili">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="contact-left">
              <Reveal as="p" className="svc-hero-heading">
                contato
              </Reveal>

              <Reveal as="h1" className="contact-heading">
                vamos conversar sobre o <br />
                seu <span className="text-accent">negócio.</span>
              </Reveal>

              <Reveal as="p" className="contact-desc">
                tem uma dúvida, quer uma proposta ou só quer trocar uma ideia? escolha um dos canais e fale com a gente.
              </Reveal>

              <Reveal className="contact-highlights">
                <div className="contact-highlight">
                  <span className="contact-highlight-num">24h</span>
                  <span className="contact-highlight-label">para retorno</span>
                </div>
                <div className="contact-highlight">
                  <span className="contact-highlight-num">+400</span>
                  <span className="contact-highlight-label">empresas atendidas</span>
                </div>
                <div className="contact-highlight">
                  <span className="contact-highlight-num">+15</span>
                  <span className="contact-highlight-label">anos de mercado</span>
                </div>
              </Reveal>

              <Reveal className="contact-channels">
                <a href={`mailto:${site.email}`} className="contact-channel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#grad-icon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10c0-.63.3-1.22.8-1.6l8-6a2 2 0 012.4 0l8 6z" />
                    <path d="M22 10l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 10" />
                  </svg>
                  <div>
                    <span className="contact-channel-label">e-mail</span>
                    <span className="contact-channel-value">{site.email}</span>
                  </div>
                </a>
                <a href={channels.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-channel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#grad-icon)" aria-hidden="true">
                    <path d="M20.52 3.48A11.38 11.38 0 0 0 12.01 0C5.38 0 .01 5.37.01 12c0 2.11.55 4.17 1.6 6L0 24l6.2-1.62a11.95 11.95 0 0 0 5.81 1.48h.01c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.5-8.38ZM12.02 21.8h-.01a9.94 9.94 0 0 1-5.08-1.39l-.36-.21-3.68.96.98-3.59-.24-.37A9.9 9.9 0 0 1 2.2 12C2.2 6.58 6.6 2.2 12.02 2.2c2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.89 6.96c0 5.42-4.4 9.74-9.87 9.74Zm5.73-7.85c-.31-.15-1.84-.9-2.13-1.01-.29-.11-.5-.15-.71.15-.21.31-.81 1.01-.99 1.22-.18.21-.36.23-.67.08-.31-.15-1.3-.48-2.48-1.52-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.36.46-.54.15-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.15-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.54.08-.83.39-.29.31-1.09 1.06-1.09 2.58 0 1.52 1.12 2.99 1.27 3.2.15.21 2.2 3.36 5.34 4.71.75.32 1.33.52 1.78.66.75.24 1.43.21 1.97.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.36.18-1.48-.08-.12-.29-.2-.6-.36Z" />
                  </svg>
                  <div>
                    <span className="contact-channel-label">whatsapp</span>
                    <span className="contact-channel-value">(11) 97623-7862</span>
                  </div>
                </a>
              </Reveal>

              <Reveal className="contact-social">
                <a href={channels.instagram} className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  instagram
                </a>
                <a href={channels.linkedin} className="contact-social-btn" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  linkedin
                </a>
              </Reveal>
            </div>
          </div>

          <div>
            <Reveal className="contact-form-card">
              <ContactForm config={cf7} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
