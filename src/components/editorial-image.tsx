import Image from 'next/image';
import { imageUrl } from '@/sanity/images';
import type { EditorialPhoto } from '@/lib/types';
import { safeHref } from '@/lib/utils';
export function EditorialImage({
  image,
  className = '',
  priority = false,
  sizes = '(max-width: 700px) 100vw, 50vw',
  ratio = 1.5,
  caption = false,
}: {
  image?: EditorialPhoto;
  className?: string;
  priority?: boolean;
  sizes?: string;
  ratio?: number;
  caption?: boolean;
}) {
  const src = imageUrl(image, 1600, Math.round(1600 / ratio));
  if (!image || !src) return <div className={`image-empty ${className}`} aria-hidden="true" />;
  return (
    <figure className={`editorial-image ${className}`}>
      <div className="image-frame">
        <Image
          src={src}
          alt={image.alt || ''}
          fill
          sizes={sizes}
          priority={priority}
          style={{
            objectFit: 'cover',
            objectPosition:
              !image.asset && image.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : 'center',
          }}
        />
      </div>
      {caption && (image.caption || image.photographer) && (
        <figcaption>
          {image.caption}
          {image.caption && image.photographer ? ' · ' : ''}
          {safeHref(image.sourceUrl) ? (
            <a href={safeHref(image.sourceUrl)} target="_blank" rel="noreferrer">
              {image.photographer || 'Fonte'}
            </a>
          ) : (
            image.photographer
          )}
          {image.license && (
            <>
              {' '}
              ·{' '}
              <a href={safeHref(image.licenseUrl)} target="_blank" rel="noreferrer">
                {image.license}
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
