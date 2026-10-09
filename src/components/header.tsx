'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { EditorialPhoto } from '@/lib/types';
import { Logo } from './logo';
import { SearchIcon, Arrow } from './icons';
export const navigation = [
  ['Textos', '/textos'],
  ['Fragmentos', '/fragmentos'],
  ['Clínica', '/clinica'],
  ['Sobre', '/sobre'],
  ['Contato', '/contato'],
];
export function Header({ logo }: { logo?: EditorialPhoto }) {
  const pathname = usePathname();
  const light = pathname === '/';
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    { title: string; href: string; type: string; excerpt?: string }[]
  >([]);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResults(data);
        setStatus(
          data.length
            ? `${data.length} resultado(s)`
            : 'Nenhum resultado. Experimente outra palavra.',
        );
      } catch (error) {
        if ((error as Error).name !== 'AbortError')
          setStatus('Não foi possível buscar agora. Tente novamente.');
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  function open(dialog: HTMLDialogElement | null) {
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    menu.current?.close();
    search.current?.close();
    document.body.style.overflow = '';
  }
  return (
    <>
      <header className={`site-header ${light ? 'header-dark' : ''}`}>
        <div className="container header-inner">
          <Logo image={logo} light={light} />
          <nav aria-label="Navegação principal" className="desktop-nav">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-controls">
            <button
              className="icon-button"
              aria-label="Buscar no site"
              onClick={() => open(search.current)}
            >
              <SearchIcon />
            </button>
            <span className="control-divider" />
            <button
              className="icon-button menu-trigger"
              aria-label="Abrir menu"
              onClick={() => open(menu.current)}
            >
              <span className="hamburger" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={menu}
        className="menu-dialog"
        onClose={() => {
          if (!search.current?.open) document.body.style.overflow = '';
        }}
      >
        <div className="dialog-top">
          <Logo />
          <button className="icon-button close-button" onClick={close} aria-label="Fechar menu">
            ×
          </button>
        </div>
        <nav aria-label="Menu completo">
          {navigation.map(([label, href], i) => (
            <Link key={href} href={href} onClick={close}>
              <span className="meta">0{i + 1}</span>
              {label}
              <Arrow diagonal />
            </Link>
          ))}
        </nav>
        <button
          className="text-link menu-search"
          onClick={() => {
            menu.current?.close();
            open(search.current);
          }}
        >
          Buscar no arquivo
          <SearchIcon />
        </button>
        <p className="meta">Psicanálise, cidade e palavra.</p>
      </dialog>
      <dialog
        ref={search}
        className="search-dialog"
        onClose={close}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            close();
          }
        }}
      >
        <div className="dialog-top">
          <span className="eyebrow">Arquivo de palavras</span>
          <button className="icon-button close-button" onClick={close} aria-label="Fechar busca">
            ×
          </button>
        </div>
        <h2>O que você procura?</h2>
        <label className="sr-only" htmlFor="site-search">
          Buscar textos, fragmentos ou temas
        </label>
        <div className="search-field">
          <input
            id="site-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setResults([]);
              setStatus(event.target.value.trim().length >= 2 ? 'Buscando…' : '');
            }}
            placeholder="Uma palavra, um tema…"
            type="search"
            autoComplete="off"
          />
          <SearchIcon />
        </div>
        <p className="meta" role="status">
          {query.trim().length < 2 ? 'Digite ao menos duas letras.' : status}
        </p>
        <div className="search-results">
          {query.trim().length >= 2 &&
            results.map((result, i) => (
              <Link key={`${result.href}-${i}`} href={result.href} onClick={close}>
                <span className="meta">{result.type}</span>
                <h3>{result.title}</h3>
                {result.excerpt && <p>{result.excerpt}</p>}
                <Arrow diagonal />
              </Link>
            ))}
        </div>
      </dialog>
    </>
  );
}
