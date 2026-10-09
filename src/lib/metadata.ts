import type { Metadata } from 'next';
import type { EditorialPhoto } from './types';
import { imageUrl } from '@/sanity/images';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image?: EditorialPhoto,
): Metadata {
  const url = `${siteUrl}${path}`;
  const picture = imageUrl(image, 1200, 630) || `${siteUrl}/opengraph-image`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: 'pt_BR',
      type: 'website',
      siteName: 'Rafael Rodrigues',
      images: [
        {
          url: picture,
          width: 1200,
          height: 630,
          alt: image?.alt || 'Rafael Rodrigues — Psicanálise, cidade e palavra',
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description, images: [picture] },
  };
}
