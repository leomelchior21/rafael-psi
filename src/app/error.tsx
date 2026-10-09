'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container error-page">
      <span className="eyebrow">Uma breve pausa</span>
      <h1>
        Não foi possível
        <br />
        carregar esta página.
      </h1>
      <button className="pill pill-ink" onClick={reset}>
        Tentar novamente →
      </button>
    </main>
  );
}
