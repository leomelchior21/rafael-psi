'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface HeroPhoto {
  src: string;
  position: string;
}

/** The paint and typography are siblings, so only photographs crossfade. */
export function HeroSlideshow({ photos }: { photos: HeroPhoto[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const displayed = active % Math.max(1, photos.length);

  useEffect(() => {
    const element = root.current;
    if (!element || photos.length < 2) return;
    element.dataset.enhanced = 'true';
    if (paused) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(element);

    const start = () => {
      if (timer) clearInterval(timer);
      if (reduced.matches) return;
      timer = setInterval(() => {
        if (
          !visible ||
          document.hidden ||
          document.body.style.overflow === 'hidden' ||
          document.querySelector('.preview-notice')
        )
          return;
        const images = element.querySelectorAll<HTMLImageElement>('.hero-slide img');
        setActive((current) => {
          const next = (current + 1) % photos.length;
          return images[next]?.complete && images[next].naturalWidth > 0 ? next : current;
        });
      }, 6500);
    };
    start();
    reduced.addEventListener('change', start);
    return () => {
      if (timer) clearInterval(timer);
      observer.disconnect();
      reduced.removeEventListener('change', start);
    };
  }, [photos.length, paused]);

  return (
    <>
      <div className="hero-photos" ref={root} data-active-slide={displayed} aria-hidden="true">
        <div className="hero-photo-motion">
          {photos.map((photo, index) => (
            <div key={photo.src} className={`hero-slide ${index === displayed ? 'is-active' : ''}`}>
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                style={{ objectFit: 'cover', objectPosition: photo.position }}
              />
            </div>
          ))}
        </div>
      </div>
      {photos.length > 1 && (
        <div className="container hero-playback">
          <span aria-hidden="true">
            {String(displayed + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label={paused ? 'Retomar fotografias' : 'Pausar fotografias'}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
            {paused ? 'Retomar' : 'Pausar'}
          </button>
        </div>
      )}
    </>
  );
}
