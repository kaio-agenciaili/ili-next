import type { Cf7Config } from "@/lib/cms/wordpress";

export type Cf7Result = { status: "success" | "error"; message: string };

type Cf7Response = {
  status?: string;
  message?: string;
  invalid_fields?: { field?: string; message?: string }[] | Record<string, { message?: string; reason?: string }>;
};

type SubmitOptions = {
  /** Traduz o nome do campo para o rótulo mostrado no erro. */
  labels: Record<string, string>;
  /** Mensagem de sucesso quando o CF7 não manda uma. */
  successFallback?: string;
  /** Mensagem quando o servidor responde erro sem detalhes. */
  errorFallback?: (status: number | string) => string;
};

/**
 * Envia os campos para a REST do Contact Form 7 e traduz a resposta numa mensagem
 * para o visitante — mesma lógica do script que existia no tema.
 */
export async function submitCf7(
  config: Cf7Config,
  fields: FormData,
  {
    labels,
    successFallback = "mensagem enviada com sucesso.",
    errorFallback = (status) => `não foi possível enviar (${status}). tente de novo ou use outro canal.`,
  }: SubmitOptions,
): Promise<Cf7Result> {
  const body = new FormData();
  body.append("_wpcf7", String(config.formId));
  body.append("_wpcf7_version", "");
  body.append("_wpcf7_locale", "pt_BR");
  body.append("_wpcf7_unit_tag", config.unitTag);
  body.append("_wpcf7_container_post", String(config.containerPost));
  fields.forEach((value, key) => body.append(key, value));

  let res: Response;
  try {
    res = await fetch(config.endpoint, { method: "POST", body, headers: { Accept: "application/json" } });
  } catch {
    return { status: "error", message: "falha de rede. verifique sua conexão e tente novamente." };
  }

  const text = await res.text();
  let data: Cf7Response = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "resposta inválida do servidor." };
  }

  if (data.status === "mail_sent") {
    return { status: "success", message: data.message || successFallback };
  }

  const parts: string[] = [];
  if (data.message) parts.push(data.message);

  const label = (name: string) => labels[name] ?? name;
  const invalid = data.invalid_fields;
  if (Array.isArray(invalid)) {
    for (const f of invalid) {
      const name = f?.field ?? "";
      const msg = f?.message ?? "";
      if (name || msg) parts.push(label(name) + (msg ? `: ${msg}` : ""));
    }
  } else if (invalid && typeof invalid === "object") {
    for (const [name, row] of Object.entries(invalid)) {
      const msg = row?.message || row?.reason || "";
      if (name || msg) parts.push(label(name) + (msg ? `: ${msg}` : ""));
    }
  }

  if (parts.length === 0 && !res.ok) {
    parts.push(errorFallback(res.status || "?"));
  }
  return { status: "error", message: parts.join(" ") };
}
