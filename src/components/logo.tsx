import Image from 'next/image';
import Link from 'next/link';
import { imageUrl } from '@/sanity/images';
import type { EditorialPhoto } from '@/lib/types';
export function Logo({ image, light = false }: { image?: EditorialPhoto; light?: boolean }) {
  return (
    <Link
      className={`logo ${light ? 'logo-light' : ''}`}
      href="/"
      aria-label="Rafael Rodrigues — página inicial"
    >
      <Image
        src={imageUrl(image, 600) || '/brand/logo-horizontal.svg'}
        alt="Rafael Rodrigues"
        width={206}
        height={58}
        priority
        unoptimized={Boolean(imageUrl(image)?.endsWith('.svg'))}
      />
    </Link>
  );
}
