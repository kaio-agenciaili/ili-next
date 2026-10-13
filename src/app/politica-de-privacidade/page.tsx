import type { Metadata } from "next";
import { Reveal } from "@/components/effects/Reveal";
import { getPageSeo } from "@/lib/cms/wordpress";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("politica-de-privacidade");
  return { title: seo.title ?? "política de privacidade | agência ili", description: seo.description };
}

function EmailLink() {
  return (
    <a className="politica-privacidade-link" href={`mailto:${site.email}`}>
      {site.email}
    </a>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <section id="politica-privacidade" className="politica-privacidade-section">
      <div className="container-ili">
        <div className="grid gap-x-6 lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3">
            <Reveal as="p" className="svc-hero-heading">
              legal
            </Reveal>
            <Reveal as="h1" className="contact-heading">
              política de privacidade
            </Reveal>
            <Reveal as="p" className="contact-desc max-w-none">
              transparência sobre como tratamos dados no site e nos canais da agência ili.
            </Reveal>

            <Reveal className="politica-privacidade-prose">
              <p>
                A agência ili está comprometida em proteger a privacidade e os dados pessoais dos nossos clientes e
                visitantes do nosso site. Esta política de privacidade explica como coletamos, usamos e protegemos as
                informações pessoais que você nos fornece. Ao acessar o nosso site ou utilizar os nossos serviços, você
                concorda com os termos desta política de privacidade.
              </p>

              <h2 className="politica-privacidade-h">1. informações de contato</h2>
              <p>
                agência ili
                <br />
                Endereço: Rua Pitú, 72 - Conjunto 46 - Brooklin - São Paulo - SP
                <br />
                Telefone: 11 9 7623 7862
                <br />
                CNPJ: 14.334.523/0001-89
                <br />
                Email: <EmailLink />
              </p>

              <h2 className="politica-privacidade-h">2. coleta de informações</h2>

              <h3 className="politica-privacidade-subh">2.1 informações pessoais</h3>
              <p>
                Coletamos informações pessoais que você nos fornece quando interage conosco, como ao preencher
                formulários de contato, fazer solicitações, assinar newsletters ou contratar nossos serviços. As
                informações pessoais podem incluir, mas não se limitam a:
              </p>
              <ul className="politica-privacidade-list">
                <li>Nome</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Endereço postal</li>
              </ul>

              <h3 className="politica-privacidade-subh">2.2 informações de uso do site</h3>
              <p>
                Também coletamos automaticamente informações sobre como você utiliza o nosso site, incluindo endereço
                IP, tipo de navegador, páginas visitadas, horários de acesso e dados de referência.
              </p>

              <h2 className="politica-privacidade-h">3. uso das informações</h2>
              <p>Utilizamos as informações coletadas para os seguintes fins:</p>
              <ul className="politica-privacidade-list">
                <li>Fornecer os serviços contratados</li>
                <li>Responder a solicitações de contato</li>
                <li>Enviar newsletters e informações promocionais, com opção de cancelamento de assinatura</li>
                <li>Melhorar o nosso site e serviços</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h2 className="politica-privacidade-h">4. compartilhamento de informações</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos as suas informações pessoais com terceiros, exceto nas seguintes
                circunstâncias:
              </p>
              <ul className="politica-privacidade-list">
                <li>Quando necessário para fornecer os serviços contratados</li>
                <li>Com prestadores de serviços terceirizados que auxiliam na operação do site e na prestação de serviços</li>
                <li>Quando exigido por lei ou regulamentação</li>
                <li>Em caso de venda, fusão ou transferência de ativos da agência ili</li>
              </ul>

              <h2 className="politica-privacidade-h">5. ferramentas de marketing e rastreamento</h2>
              <p>
                Utilizamos ferramentas de marketing, como RD Station, Google Tag Manager (GTM), Google Analytics e
                Hotjar, para melhorar a experiência do usuário e analisar o desempenho do nosso site. Essas ferramentas
                podem coletar informações de uso, mas não coletam informações pessoais identificáveis, a menos que você
                as forneça voluntariamente.
              </p>

              <h2 className="politica-privacidade-h">6. cookies</h2>
              <p>
                Utilizamos cookies para melhorar a sua experiência de navegação em nosso site. Você pode configurar o seu
                navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
              </p>

              <h2 className="politica-privacidade-h">7. segurança</h2>
              <p>
                Tomamos medidas de segurança para proteger as suas informações pessoais contra acesso não autorizado,
                uso indevido ou divulgação.
              </p>

              <h2 className="politica-privacidade-h">8. alterações na política de privacidade</h2>
              <p>
                Esta política de privacidade pode ser atualizada periodicamente. Recomendamos que você reveja esta
                política regularmente para estar ciente de quaisquer alterações.
              </p>

              <h2 className="politica-privacidade-h">9. contato</h2>
              <p>
                Se tiver dúvidas sobre esta política de privacidade ou sobre como tratamos as suas informações, entre em
                contato conosco através do e-mail <EmailLink />.
              </p>

              <p className="politica-privacidade-foot">
                Ao continuar a usar o nosso site ou serviços, você concorda com esta política de privacidade e com a
                coleta e uso de suas informações pessoais conforme descrito acima.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
