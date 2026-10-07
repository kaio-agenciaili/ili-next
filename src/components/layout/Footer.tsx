import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { routes, site } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="footer-ili">
      <div className="container-ili relative z-1">
        <div className="divider-glow mb-6" />
        <div className="mt-24 mb-12 grid grid-cols-2 gap-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <div className="mb-6">
              <Image src="/img/logo-footer.svg" alt={site.name} width={127} height={32} className="h-[32px] w-auto" />
            </div>
            <p className="max-w-[260px] text-sm leading-[1.7] text-muted-foreground lowercase">
              Estratégia, marca e execução. <br />A parceria que conecta visão a resultado.
            </p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="footer-heading">navegação</div>
            <Link href={routes.home} className="footer-link">
              home
            </Link>
            <Link href={routes.metodo} className="footer-link">
              método
            </Link>
            {/* <Link href={routes.cases} className="footer-link">cases</Link> — oculto no site atual */}
            <Link href={routes.servicos} className="footer-link">
              serviços
            </Link>
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="footer-heading">empresa</div>
            <Link href={routes.quemSomos} className="footer-link">
              quem somos
            </Link>
            <Link href={routes.servicos} className="footer-link">
              serviços
            </Link>
            <Link href={routes.diagnostico} className="footer-link">
              diagnóstico
            </Link>
            <Link href={routes.contato} className="footer-link">
              contato
            </Link>
          </div>
          <div className="col-span-2 md:col-span-4">
            <div className="footer-heading">vamos conversar</div>
            <p className="max-w-[280px] text-sm leading-[1.7] text-muted-foreground lowercase">
              pronto para elevar sua marca? entre em contato e vamos construir juntos.
            </p>
            <Link href={routes.diagnostico} className="btn-ili mt-2">
              quero um diagnóstico
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-2 text-left text-[0.75rem] text-muted-foreground opacity-60 md:flex-row">
          <span>
            &copy; <CurrentYear /> - {site.name}. Todos os direitos reservados.
          </span>
          <span>Estratégia &middot; Marca &middot; Execução</span>
        </div>
      </div>
    </footer>
  );
}
