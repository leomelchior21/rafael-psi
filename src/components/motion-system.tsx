'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const ease = 'expo.out';

/** One owner for route entrances, image reveals, scrolling and their cleanup. */
export function MotionSystem({ enabled = true }: { enabled?: boolean }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const shell = document.querySelector<HTMLElement>('.site-shell');
    if (!shell || !enabled) return;
    const media = gsap.matchMedia();
    const listeners: (() => void)[] = [];

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const hero = shell.querySelector('.hero');
        const main = shell.querySelector('main');
        const onOpening = Boolean(hero) && window.scrollY < 40;

        if (hero && onOpening) {
          const opening = gsap.timeline({ defaults: { ease } });
          opening
            .from('.hero-photo-motion', { scale: 1.04, duration: 1.6, clearProps: 'transform' }, 0)
            .fromTo(
              '.hero-brush',
              { clipPath: 'inset(0 100% 0 0)', opacity: 0.15 },
              {
                clipPath: 'inset(0 0% 0 0)',
                opacity: 0.95,
                duration: 3.4,
                ease: 'power2.inOut',
                clearProps: 'clipPath,opacity',
              },
              0.25,
            )
            .from('.site-header .logo', { opacity: 0, y: 8, duration: 0.5 }, 0.05)
            .from(
              '.desktop-nav a, .header-controls',
              { opacity: 0, y: 6, stagger: 0.035, duration: 0.45 },
              0.15,
            )
            .from('.hero-eyebrow', { opacity: 0, duration: 0.5 }, 0.24)
            .from('.hero .title-line-inner', { yPercent: 106, stagger: 0.1, duration: 0.95 }, 0.35)
            .from('.hero-subtitle', { opacity: 0, y: 18, duration: 0.65 }, 0.65)
            .from('.hero-actions a', { opacity: 0, y: 10, stagger: 0.08, duration: 0.45 }, 0.8)
            .from('.hero-footnote, .hero-playback', { opacity: 0, duration: 0.5 }, 1.15);
        } else if (main) {
          gsap.from(main, {
            opacity: 0,
            y: 12,
            duration: 0.5,
            ease,
            clearProps: 'opacity,transform',
          });
          const lines = main.querySelectorAll('[data-heading-reveal] .title-line-inner');
          if (lines.length)
            gsap.from(lines, {
              yPercent: 104,
              duration: 0.85,
              stagger: 0.1,
              delay: 0.1,
              ease,
              clearProps: 'transform',
            });
        }

        shell.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
          if (element.getBoundingClientRect().bottom < 0) return;
          gsap.from(element, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease,
            delay: Number(element.dataset.revealDelay || 0),
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: element, start: 'top 91%', once: true },
          });
        });

        shell.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
          gsap.from(group.children, {
            opacity: 0,
            y: 24,
            duration: 0.95,
            stagger: 0.18,
            ease,
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          });
        });

        shell.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((figure) => {
          const frame = figure.querySelector('.image-frame');
          if (!frame || figure.getBoundingClientRect().bottom < 0) return;
          const mask =
            figure.dataset.imageReveal === 'vertical' ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)';
          gsap.fromTo(
            frame,
            { clipPath: mask },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.1,
              ease,
              delay: Number(figure.dataset.revealDelay || 0),
              clearProps: 'clipPath',
              scrollTrigger: { trigger: figure, start: 'top 90%', once: true },
            },
          );
        });

        const refresh = () => ScrollTrigger.refresh();
        shell.addEventListener('load', refresh, true);
        let alive = true;
        document.fonts.ready.then(() => {
          if (alive) refresh();
        });
        return () => {
          alive = false;
          shell.removeEventListener('load', refresh, true);
        };
      },
      shell,
    );

    media.add(
      '(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const lenis = new Lenis({
          autoRaf: true,
          lerp: 0.13,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -120 },
          prevent: (node) => Boolean(node.closest('dialog, [data-native-scroll]')),
        });
        lenis.on('scroll', ScrollTrigger.update);
        document.documentElement.dataset.smoothScroll = 'true';
        const syncOverlay = () => {
          if (document.body.style.overflow === 'hidden') lenis.stop();
          else lenis.start();
        };
        const observer = new MutationObserver(syncOverlay);
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
        syncOverlay();

        shell.querySelectorAll('[data-image-depth] .image-inner').forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 1.03 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: image.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            },
          );
        });

        shell.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((link) => {
          const arrow = link.querySelector('svg');
          if (!arrow) return;
          const x = gsap.quickTo(arrow, 'x', { duration: 0.5, ease: 'power3.out' });
          const y = gsap.quickTo(arrow, 'y', { duration: 0.5, ease: 'power3.out' });
          const move = (event: PointerEvent) => {
            const box = link.getBoundingClientRect();
            x(Math.max(-6, Math.min(6, (event.clientX - box.left - box.width / 2) * 0.055)));
            y(Math.max(-5, Math.min(5, (event.clientY - box.top - box.height / 2) * 0.12)));
          };
          const leave = () => {
            x(0);
            y(0);
          };
          link.addEventListener('pointermove', move);
          link.addEventListener('pointerleave', leave);
          listeners.push(() => {
            link.removeEventListener('pointermove', move);
            link.removeEventListener('pointerleave', leave);
          });
        });

        return () => {
          observer.disconnect();
          listeners.splice(0).forEach((remove) => remove());
          lenis.destroy();
          delete document.documentElement.dataset.smoothScroll;
        };
      },
      shell,
    );

    return () => {
      media.revert();
    };
  }, [pathname, enabled]);

  return null;
}
