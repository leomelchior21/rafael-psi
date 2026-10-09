'use client';

import { useEffect, useRef, useState } from 'react';
import type { Fragment } from '@/lib/types';
import { FragmentCard } from './fragment-card';

export function FragmentRotator({ fragments }: { fragments: Fragment[] }) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef({ index: 0, count: 0, holding: false });
  const [frame, setFrame] = useState({ index: 0, text: fragments[0]?.text || '', writing: false });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element || !fragments.length) return;
    element.dataset.enhanced = 'true';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const texts = fragments.map((fragment) => Array.from(fragment.text));
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const stop = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
    };
    const canRun = () =>
      visible &&
      !paused &&
      !document.hidden &&
      !reduced.matches &&
      document.body.style.overflow !== 'hidden' &&
      !document.querySelector('.preview-notice');
    const schedule = (delay: number) => {
      stop();
      timer = setTimeout(tick, delay);
    };
    const tick = () => {
      timer = undefined;
      if (disposed || !canRun()) return;
      const cursor = progress.current;
      cursor.index %= fragments.length;
      if (cursor.holding) {
        if (fragments.length < 2) return;
        cursor.index = (cursor.index + 1) % fragments.length;
        cursor.count = 0;
        cursor.holding = false;
        setFrame({ index: cursor.index, text: '', writing: true });
        schedule(250);
        return;
      }
      const text = texts[cursor.index];
      cursor.count = Math.min(cursor.count + 1, text.length);
      cursor.holding = cursor.count === text.length;
      setFrame({
        index: cursor.index,
        text: text.slice(0, cursor.count).join(''),
        writing: !cursor.holding,
      });
      schedule(
        cursor.holding
          ? Math.max(3600, text.length * 38)
          : Math.max(15, Math.min(44, 1800 / text.length)),
      );
    };
    const resume = () => {
      stop();
      if (canRun()) schedule(progress.current.holding ? 3600 : 90);
    };
    const onMotion = () => {
      if (reduced.matches) {
        stop();
        const index = progress.current.index % fragments.length;
        progress.current = { index, count: texts[index].length, holding: true };
        setFrame({ index, text: fragments[index].text, writing: false });
      } else resume();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        resume();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    const overlays = new MutationObserver(resume);
    overlays.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    reduced.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', resume);
    if (reduced.matches) onMotion();
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      overlays.disconnect();
      reduced.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [fragments, paused]);

  const index = frame.index % Math.max(1, fragments.length);
  return (
    <div
      className="fragment-rotation"
      ref={root}
      data-active-fragment={index}
      data-writing={frame.writing && !paused}
      data-reveal
    >
      <div className="home-fragments">
        {fragments.map((fragment, item) => (
          <div
            key={fragment._id}
            className="fragment-slide"
            data-active={item === index}
            aria-hidden={item !== index}
          >
            <FragmentCard fragment={fragment} typedText={item === index ? frame.text : undefined} />
          </div>
        ))}
      </div>
      {fragments.length > 1 && (
        <button
          className="fragment-pause"
          type="button"
          aria-label={paused ? 'Retomar fragmentos' : 'Pausar fragmentos'}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
          {paused ? 'Retomar' : 'Pausar'}
        </button>
      )}
    </div>
  );
}
