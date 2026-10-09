import { PortableText } from '@portabletext/react';
import type { Body } from '@/lib/types';
import { EditorialImage } from './editorial-image';
import { safeHref } from '@/lib/utils';
export function PortableTextRenderer({ value }: { value?: Body }) {
  if (!value?.length) return null;
  return (
    <div className="prose">
      <PortableText
        value={value}
        components={{
          types: {
            editorialImage: ({ value }) => (
              <EditorialImage image={value} caption sizes="(max-width: 760px) 100vw, 740px" />
            ),
          },
          marks: {
            link: ({ value, children }) => {
              const href = safeHref(value?.href);
              return href ? <a href={href}>{children}</a> : <>{children}</>;
            },
          },
        }}
      />
    </div>
  );
}
