import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="container error-page">
      <span className="eyebrow">404 · Um desvio no caminho</span>
      <h1>
        Esta página
        <br />
        não está aqui.
      </h1>
      <Link href="/" className="pill pill-ink">
        Voltar ao início →
      </Link>
    </main>
  );
}
