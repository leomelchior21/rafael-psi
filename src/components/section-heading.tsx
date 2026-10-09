import Link from 'next/link';
import { Arrow } from './icons';
export function SectionHeading({
  title,
  href,
  label = 'Ver todos',
}: {
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-heading" data-reveal>
      <h2>{title}</h2>
      {href && (
        <Link className="text-link" href={href} data-magnetic>
          {label}
          <Arrow />
        </Link>
      )}
    </div>
  );
}
