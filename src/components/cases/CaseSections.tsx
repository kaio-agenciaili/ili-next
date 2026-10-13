import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import type { CaseDetail, CaseTextBlock, CmsImage } from "@/lib/cms/wordpress";
import { cx } from "@/lib/cx";

/* Seções da página interna do case — mesma ordem e mesmas regras de exibição do `single-ili_case.php`. */

function FullImage({ image, fluid = false }: { image: CmsImage; fluid?: boolean }) {
  return (
    <Reveal className="csb csb-img-full">
      <div className={fluid ? "container-fluid-ili" : "container-ili"}>
        <Image src={image.url} alt="" width={image.width} height={image.height} sizes={fluid ? "100vw" : "(max-width: 1400px) 100vw, 1296px"} />
      </div>
    </Reveal>
  );
}

function DoubleImage({ images }: { images: CmsImage[] }) {
  return (
    <Reveal className="csb csb-img-double">
      <div className="container-ili">
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((image, i) => (
            <div key={i}>
              <Image src={image.url} alt="" width={image.width} height={image.height} sizes="(max-width: 767px) 100vw, 1400px" />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/** Título à esquerda (sticky) + texto do editor à direita. */
function TextBlock({ block }: { block: CaseTextBlock }) {
  if (block.titleHtml === "" && block.textHtml === "") return null;
  return (
    <Reveal className="csb csb-text">
      <div className="container-ili">
        <div className="csb-text-split">
          {block.titleHtml !== "" && (
            <div className="csb-text-label">
              <h2 dangerouslySetInnerHTML={{ __html: block.titleHtml }} />
            </div>
          )}
          {block.textHtml !== "" && (
            <div className="csb-text-content entry-content" dangerouslySetInnerHTML={{ __html: block.textHtml }} />
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function CaseChallenge({ item }: { item: CaseDetail }) {
  const { image, ...text } = item.challenge;
  return (
    <>
      {image && <FullImage image={image} />}
      <TextBlock block={text} />
    </>
  );
}

export function CaseSolve({ item }: { item: CaseDetail }) {
  const { images, ...text } = item.solve;
  return (
    <>
      {images.length > 0 && <DoubleImage images={images} />}
      <TextBlock block={text} />
    </>
  );
}

export function CaseStrategy({ item }: { item: CaseDetail }) {
  const { image, ...text } = item.strategy;
  return (
    <>
      {image && <FullImage image={image} fluid />}
      <TextBlock block={text} />
    </>
  );
}

export function CaseSolutions({ item }: { item: CaseDetail }) {
  const { images, ...text } = item.solutions;
  return (
    <>
      {images.length > 0 && <DoubleImage images={images} />}
      <TextBlock block={text} />
    </>
  );
}

export function CaseTestimonial({ item }: { item: CaseDetail }) {
  const { titleHtml, textHtml, name, role, company, photo } = item.testimonial;
  const hasAuthor = name !== "" || role !== "" || company !== "";
  const hasFooter = photo !== null || hasAuthor;
  const hasQuote = textHtml !== "" || hasFooter;
  if (titleHtml === "" && !hasQuote) return null;

  return (
    <Reveal className="csb csb-quote">
      <div className="container-ili">
        <div className="csb-quote-split">
          {titleHtml !== "" && (
            <div className="csb-quote-label">
              <h2 dangerouslySetInnerHTML={{ __html: titleHtml }} />
            </div>
          )}
          {hasQuote && (
            <blockquote>
              {textHtml !== "" && <p dangerouslySetInnerHTML={{ __html: textHtml }} />}
              {hasFooter && (
                <footer className="csb-quote-author">
                  {photo && <Image src={photo.url} alt={name} width={120} height={120} className="csb-quote-avatar" />}
                  {hasAuthor && (
                    <div className="csb-quote-author-line">
                      {name !== "" && <strong>{name}</strong>}
                      {role !== "" && (
                        <>
                          {name !== "" && (
                            <span className="csb-quote-sep" aria-hidden="true">
                              {" · "}
                            </span>
                          )}
                          <span>{role}</span>
                        </>
                      )}
                      {company !== "" && (
                        <>
                          {(name !== "" || role !== "") && (
                            <span className="csb-quote-sep" aria-hidden="true">
                              {" · "}
                            </span>
                          )}
                          <span className="text-accent">{company}</span>
                        </>
                      )}
                    </div>
                  )}
                </footer>
              )}
            </blockquote>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function CaseResults({ item }: { item: CaseDetail }) {
  const { titleHtml, items } = item.results;
  if (titleHtml === "" && items.length === 0) return null;

  return (
    <Reveal className="csb csb-stats">
      <div className="container-ili">
        <div className="csb-stats-split">
          {titleHtml !== "" && (
            <div className="csb-stats-label">
              <h2 dangerouslySetInnerHTML={{ __html: titleHtml }} />
            </div>
          )}
          {items.length > 0 && (
            <div className="csb-stats-grid">
              {items.map((stat, i) => (
                <div key={i} className={cx("csb-stat", "cs-stagger")}>
                  {stat.numeroHtml !== "" && <span className="csb-stat-num" dangerouslySetInnerHTML={{ __html: stat.numeroHtml }} />}
                  {stat.descricao !== "" && <span className="csb-stat-label">{stat.descricao}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
