/** CMS-authored line breaks stay intact; no letter splitting or client-only text. */
export function RevealHeading({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n').filter(Boolean);
  return (
    <h1 className={className} data-heading-reveal aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((line, index) => (
        <span className="title-line" key={index}>
          <span className="title-line-inner">{line}</span>
        </span>
      ))}
    </h1>
  );
}
