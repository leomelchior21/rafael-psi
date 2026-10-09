import 'server-only';
import { cache } from 'react';
import { sanityFetch } from '@/sanity/live';
import type { About, Article, Clinic, Contact, Fragment, Home, Settings, Topic } from './types';
import { demoContent } from '../../data/demo';
export const isDemo = process.env.DEMO_MODE === 'true';
const articleProjection =
  '{_id,title,slug,subtitle,excerpt,publishedAt,topic->,heroImage,demo,"body":body[_type == "editorialImage"]}';
async function fetchContent<T>(
  query: string,
  fallback: T,
  params: Record<string, string> = {},
): Promise<T> {
  if (isDemo) return fallback;
  const { data } = await sanityFetch({ query, params });
  return data as T;
}
export const getSettings = cache(
  async (): Promise<Settings> =>
    (await fetchContent<Settings | null>(
      '*[_type == "siteSettings" && _id == "siteSettings"][0]',
      demoContent.settings,
    )) || {},
);
export const getHome = cache(
  async (): Promise<Home> =>
    (await fetchContent<Home | null>(
      `*[_type == "homePage" && _id == "homePage"][0]{..., "featuredArticles": featuredArticles[@->publishedAt <= now() && defined(@->slug.current)]->${articleProjection}, "featuredFragments": featuredFragments[@->publishedAt <= now()]->{...,topic->}}`,
      demoContent.home,
    )) || {},
);
export const getArticles = cache(
  async (): Promise<Article[]> =>
    (await fetchContent<Article[]>(
      `*[_type == "article" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) ${articleProjection}`,
      demoContent.articles,
    )) || [],
);
export const getArticle = cache(async (slug: string) =>
  fetchContent<Article | undefined>(
    '*[_type == "article" && slug.current == $slug && publishedAt <= now()][0]{...,topic->}',
    demoContent.articles.find((article) => article.slug.current === slug),
    { slug },
  ),
);
export const getFragments = cache(
  async (): Promise<Fragment[]> =>
    (await fetchContent<Fragment[]>(
      '*[_type == "fragment" && publishedAt <= now()] | order(publishedAt desc) {..., topic->}',
      demoContent.fragments,
    )) || [],
);
export const getTopics = cache(
  async (): Promise<Topic[]> =>
    (await fetchContent<Topic[]>('*[_type == "topic"] | order(title asc)', demoContent.topics)) ||
    [],
);
export const getClinic = cache(
  async (): Promise<Clinic> =>
    (await fetchContent<Clinic | null>(
      '*[_type == "clinicPage" && _id == "clinicPage"][0]',
      demoContent.clinic,
    )) || {},
);
export const getAbout = cache(
  async (): Promise<About> =>
    (await fetchContent<About | null>(
      '*[_type == "aboutPage" && _id == "aboutPage"][0]',
      demoContent.about,
    )) || {},
);
export const getContact = cache(
  async (): Promise<Contact> =>
    (await fetchContent<Contact | null>(
      '*[_type == "contactPage" && _id == "contactPage"][0]',
      demoContent.contact,
    )) || {},
);
