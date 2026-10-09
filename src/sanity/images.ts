import { createImageUrlBuilder } from '@sanity/image-url';
import { projectId, dataset } from './env';
import type { EditorialPhoto } from '@/lib/types';
const builder = createImageUrlBuilder({ projectId, dataset });
export function imageUrl(image?: EditorialPhoto, width = 1600, height?: number) {
  if (!image) return undefined;
  if (!image.asset?._ref) return image.localPath;
  let url = builder.image(image).width(width).fit('crop').auto('format');
  if (height) url = url.height(height);
  return url.quality(85).url();
}
