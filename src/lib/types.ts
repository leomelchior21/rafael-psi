import type { PortableTextBlock } from '@portabletext/types';
export interface EditorialPhoto {
  _type?: string;
  asset?: { _ref: string; _type?: 'reference' };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt: string;
  caption?: string;
  credit?: string;
  photographer?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  localPath?: string;
}
export interface Topic {
  _id: string;
  title: string;
  slug?: { current: string };
}
export type Body = (
  PortableTextBlock | (EditorialPhoto & { _type: 'editorialImage'; _key: string })
)[];
export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  excerpt?: string;
  publishedAt: string;
  topic?: Topic;
  heroImage?: EditorialPhoto;
  body?: Body;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: EditorialPhoto;
  demo?: boolean;
}
export interface Fragment {
  _id: string;
  text: string;
  publishedAt: string;
  topic?: Topic;
  source?: string;
  author?: string;
  image?: EditorialPhoto;
  demo?: boolean;
}
export interface SEO {
  title?: string;
  description?: string;
  image?: EditorialPhoto;
}
export interface Settings {
  nome?: string;
  logoHorizontal?: EditorialPhoto;
  monograma?: EditorialPhoto;
  descricaoDoSite?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  enderecoOpcional?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: EditorialPhoto;
}
export interface Home {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: EditorialPhoto;
  heroPrimaryCTA?: string;
  heroGallery?: EditorialPhoto[];
  heroSecondaryCTA?: string;
  featuredArticles?: Article[];
  featuredFragments?: Fragment[];
  clinicTitle?: string;
  clinicShortText?: string;
  clinicImage?: EditorialPhoto;
  homepageSEO?: SEO;
}
export interface Clinic {
  title?: string;
  intro?: string;
  body?: Body;
  modalities?: string[];
  city?: string;
  clinicImage?: EditorialPhoto;
  contactText?: string;
  whatsappCTA?: string;
  seo?: SEO;
}
export interface About {
  title?: string;
  intro?: string;
  portrait?: EditorialPhoto;
  biography?: Body;
  trainingItems?: { _key: string; title: string; detail?: string }[];
  additionalSections?: { _key: string; title: string; body: Body }[];
  seo?: SEO;
}
export interface Contact {
  title?: string;
  intro?: string;
  email?: string;
  whatsapp?: string;
  formEnabled?: boolean;
  formRecipient?: string;
  seo?: SEO;
}
