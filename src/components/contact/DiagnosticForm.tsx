"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { submitCf7, type Cf7Result } from "@/lib/cf7";
import type { Cf7Config } from "@/lib/cms/wordpress";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

const CONSENT_TEXT =
  "li e concordo com o tratamento dos meus dados para retorno sobre o diagnóstico, conforme a política de privacidade.";

/** Rótulos usados nas mensagens de erro do CF7. */
const LABELS: Record<string, string> = {
  nome: "nome completo",
  email: "e-mail corporativo",
  telefone: "telefone / whatsapp",
  cargo: "seu cargo",
  empresa: "empresa",
  site: "site",
  segmento: "segmento",
  faturamento: "faturamento anual",
  investimento_mensal: "investimento mensal em marketing",
  prazo_inicio: "quando quer começar?",
  mensagem: "conte mais sobre o momento da empresa",
  como_conheceu: "como nos encontrou?",
  consentimento: CONSENT_TEXT,
};

const challenges = [
  ["posicionamento", "posicionamento fraco"],
  ["roi", "investimento sem retorno"],
  ["leads", "poucos leads qualificados"],
  ["dados", "dados desorganizados"],
  ["comunicacao", "comunicação inconsistente"],
  ["escala", "dificuldade de escalar"],
  ["site", "site desatualizado"],
  ["outro", "outro"],
];

function Select({ id, name, label, placeholder, options }: { id: string; name: string; label: string; placeholder: string; options: string[] }) {
  return (
    <>
      <label className="contact-label" htmlFor={id}>
        {label}
      </label>
      <select className="contact-input contact-select" id={id} name={name} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

export function DiagnosticForm({ config }: { config: Cf7Config }) {
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
    const outcome = await submitCf7(config, new FormData(form), {
      labels: LABELS,
      successFallback: "solicitação enviada com sucesso.",
      errorFallback: (status) => `não foi possível enviar (${status}). tente de novo.`,
    });
    setResult(outcome);
    setSending(false);
    if (outcome.status === "success") form.reset();
  }

  return (
    <form className="contact-form" id="diagnosticoForm" onSubmit={onSubmit}>
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
        <span className="contact-form-section-label">sobre você</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="contact-label" htmlFor="dName">
              nome completo *
            </label>
            <input type="text" className="contact-input" id="dName" name="nome" autoComplete="name" placeholder="seu nome" required />
          </div>
          <div>
            <label className="contact-label" htmlFor="dEmail">
              e-mail corporativo *
            </label>
            <input type="email" className="contact-input" id="dEmail" name="email" autoComplete="email" placeholder="nome@empresa.com" required />
          </div>
          <div>
            <label className="contact-label" htmlFor="dPhone">
              telefone / whatsapp
            </label>
            <input type="tel" className="contact-input" id="dPhone" name="telefone" autoComplete="tel" placeholder="(00) 00000-0000" />
          </div>
          <div>
            <label className="contact-label" htmlFor="dRole">
              seu cargo
            </label>
            <input type="text" className="contact-input" id="dRole" name="cargo" autoComplete="organization-title" placeholder="ex: diretor de marketing" />
          </div>
        </div>
      </div>

      <div className="contact-form-section">
        <span className="contact-form-section-label">sobre a empresa</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="contact-label" htmlFor="dCompany">
              empresa *
            </label>
            <input type="text" className="contact-input" id="dCompany" name="empresa" autoComplete="organization" placeholder="nome da empresa" required />
          </div>
          <div>
            <label className="contact-label" htmlFor="dSite">
              site
            </label>
            <input type="url" className="contact-input" id="dSite" name="site" autoComplete="url" placeholder="https://suaempresa.com.br" />
          </div>
          <div>
            <Select
              id="dSegment"
              name="segmento"
              label="segmento"
              placeholder="selecione"
              options={["tecnologia / SaaS", "serviços financeiros", "saúde", "educação", "varejo / e-commerce", "indústria", "imobiliário", "franquias", "outro"]}
            />
          </div>
          <div>
            <Select
              id="dSize"
              name="faturamento"
              label="faturamento anual"
              placeholder="selecione"
              options={["até R$ 1 milhão", "R$ 1–5 milhões", "R$ 5–20 milhões", "R$ 20–100 milhões", "acima de R$ 100 milhões", "prefiro não informar"]}
            />
          </div>
        </div>
      </div>

      <div className="contact-form-section">
        <span className="contact-form-section-label">onde está o desafio?</span>
        <div className="contact-tags">
          {challenges.map(([value, label]) => (
            <label key={value} className="contact-tag-check">
              {/* `desafios[]`: no tema era `desafios` e só o último marcado chegava ao CF7. */}
              <input type="checkbox" name="desafios[]" value={value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="contact-form-section">
        <span className="contact-form-section-label">detalhes</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Select
              id="dBudget"
              name="investimento_mensal"
              label="investimento mensal em marketing"
              placeholder="selecione a faixa"
              options={["ainda não invisto", "até R$ 5 mil/mês", "R$ 5–15 mil/mês", "R$ 15–50 mil/mês", "acima de R$ 50 mil/mês", "preciso de orientação"]}
            />
          </div>
          <div>
            <Select
              id="dTimeline"
              name="prazo_inicio"
              label="quando quer começar?"
              placeholder="selecione"
              options={["o mais rápido possível", "próximas 2 semanas", "próximo mês", "estou planejando", "só quero entender"]}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="contact-label" htmlFor="dMsg">
              conte mais sobre o momento da empresa
            </label>
            <textarea
              className="contact-input contact-textarea"
              id="dMsg"
              name="mensagem"
              rows={4}
              placeholder="qual é o principal desafio do marketing hoje? o que já tentaram? o que esperam de um diagnóstico?"
            />
          </div>
          <div>
            <Select
              id="dHow"
              name="como_conheceu"
              label="como nos encontrou?"
              placeholder="selecione"
              options={["Google", "Instagram", "LinkedIn", "indicação", "evento", "outro"]}
            />
          </div>
        </div>
      </div>

      <div className="contact-consent">
        <input type="checkbox" className="contact-consent-input" id="dConsent" name="consentimento" value="1" required />
        <label className="contact-consent-label" htmlFor="dConsent">
          li e concordo com o tratamento dos meus dados para retorno sobre o diagnóstico, conforme a{" "}
          <Link href={routes.politicaPrivacidade} className="contact-consent-link" target="_blank" rel="noopener noreferrer">
            política de privacidade
          </Link>
          . *
        </label>
      </div>

      <button type="submit" className="btn-ili contact-submit-btn" disabled={sending} aria-busy={sending || undefined}>
        solicitar diagnóstico gratuito
      </button>
      <p className="contact-form-privacy">sem compromisso. respondemos em até 24h úteis.</p>
    </form>
  );
}
