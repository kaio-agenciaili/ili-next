"use client";

import { useEffect, useRef } from "react";

/**
 * Vídeo de fundo em loop e sem som.
 * O React não envia o atributo `muted` no HTML do servidor, e sem ele os navegadores
 * bloqueiam o autoplay — por isso garantimos `muted` + `play()` no cliente.
 */
export function BackgroundVideo({ src, type, className }: { src: string; type?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
      <source src={src} type={type || undefined} />
    </video>
  );
}
