"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { submitCf7, type Cf7Result } from "@/lib/cf7";
import type { Cf7Config } from "@/lib/cms/wordpress";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

const CONSENT_TEXT = "li e concordo com o tratamento dos meus dados para retorno deste contato, conforme a política de privacidade.";

/** Rótulos usados nas mensagens de erro do CF7. */
const LABELS: Record<string, string> = {
  nome: "nome",
  email: "e-mail",
  telefone: "telefone / whatsapp",
  empresa: "empresa",
  assunto: "assunto",
  mensagem: "mensagem",
  consentimento: CONSENT_TEXT,
};

export function ContactForm({ config }: { config: Cf7Config }) {
  const [result, setResult] = useState<Cf7Result | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setResult(null);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSending(true);
    const outcome = await submitCf7(config, new FormData(form), { labels: LABELS });
    setResult(outcome);
    setSending(false);
    if (outcome.status === "success") form.reset();
  }

  return (
    <form className="contact-form" id="contactForm" onSubmit={onSubmit}>
      <div
        className={cx(
          "contact-form-status",
          result?.status === "success" && "contact-form-status--success",
          result?.status === "error" && "contact-form-status--error",
        )}
        role="status"
        aria-live="polite"
        hidden={!result?.message}
      >
        {result?.message}
      </div>

      <div className="contact-form-section">
        <span className="contact-form-section-label">seus dados</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="contact-label" htmlFor="cName">
              nome *
            </label>
            <input type="text" className="contact-input" id="cName" name="nome" autoComplete="name" placeholder="seu nome" required />
          </div>
          <div>
            <label className="contact-label" htmlFor="cEmail">
              e-mail *
            </label>
            <input type="email" className="contact-input" id="cEmail" name="email" autoComplete="email" placeholder="nome@empresa.com" required />
          </div>
          <div>
            <label className="contact-label" htmlFor="cPhone">
              telefone / whatsapp
            </label>
            <input type="tel" className="contact-input" id="cPhone" name="telefone" autoComplete="tel" placeholder="(00) 00000-0000" />
          </div>
          <div>
            <label className="contact-label" htmlFor="cCompany">
              empresa
            </label>
            <input type="text" className="contact-input" id="cCompany" name="empresa" autoComplete="organization" placeholder="nome da empresa" />
          </div>
        </div>
      </div>

      <div className="contact-form-section">
        <span className="contact-form-section-label">sua mensagem</span>
        <div className="grid gap-4">
          <div>
            <label className="contact-label" htmlFor="cSubject">
              assunto *
            </label>
            <select className="contact-input contact-select" id="cSubject" name="assunto" required defaultValue="">
              <option value="" disabled>
                selecione
              </option>
              <option value="quero uma proposta">quero uma proposta</option>
              <option value="dúvida sobre serviços">dúvida sobre serviços</option>
              <option value="parceria / fornecedor">parceria / fornecedor</option>
              <option value="imprensa">imprensa</option>
              <option value="outro">outro</option>
            </select>
          </div>
          <div>
            <label className="contact-label" htmlFor="cMsg">
              mensagem *
            </label>
            <textarea
              className="contact-input contact-textarea"
              id="cMsg"
              name="mensagem"
              rows={4}
              placeholder="conte como podemos ajudar..."
              required
            />
          </div>
        </div>
      </div>

      <div className="contact-consent">
        <input type="checkbox" className="contact-consent-input" id="cConsent" name="consentimento" value="1" required />
        <label className="contact-consent-label" htmlFor="cConsent">
          li e concordo com o tratamento dos meus dados para retorno deste contato, conforme a{" "}
          <Link href={routes.politicaPrivacidade} className="contact-consent-link" target="_blank" rel="noopener noreferrer">
            política de privacidade
          </Link>
          . *
        </label>
      </div>

      <button type="submit" className="btn-ili contact-submit-btn" disabled={sending} aria-busy={sending || undefined}>
        enviar mensagem
      </button>
      <p className="contact-form-privacy">respondemos em até 24h úteis.</p>
    </form>
  );
}
