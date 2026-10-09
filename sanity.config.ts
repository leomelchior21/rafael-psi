'use client';
import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { ptPTLocale } from '@sanity/locale-pt-pt';
import { schemaTypes, singletonTypes } from './src/sanity/schema';
import { projectId, dataset } from './src/sanity/env';
const singleton = (S: StructureBuilder, type: string, label: string, group?: string) =>
  S.listItem()
    .id(group || type)
    .title(label)
    .child(S.document().schemaType(type).documentId(type).title(label).views([S.view.form()]));
export default defineConfig({
  name: 'rafael-rodrigues',
  title: 'Rafael Rodrigues · Publicação',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    ptPTLocale(),
    structureTool({
      title: 'Conteúdo',
      structure: (S) =>
        S.list()
          .title('Publicação')
          .items([
            S.listItem()
              .title('Conteúdo')
              .child(
                S.list()
                  .title('Conteúdo')
                  .items([
                    S.documentTypeListItem('article').title('Textos'),
                    S.documentTypeListItem('fragment').title('Fragmentos'),
                    S.documentTypeListItem('topic').title('Temas'),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title('Páginas')
              .child(
                S.list()
                  .title('Páginas')
                  .items([
                    singleton(S, 'homePage', 'Página inicial'),
                    singleton(S, 'clinicPage', 'Clínica'),
                    singleton(S, 'aboutPage', 'Sobre'),
                    singleton(S, 'contactPage', 'Contato'),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title('Configurações')
              .child(
                S.list()
                  .title('Configurações')
                  .items([singleton(S, 'siteSettings', 'Identidade, SEO, redes e contato')]),
              ),
          ]),
    }),
    presentationTool({
      title: 'Pré-visualizar',
      previewUrl: { initial: '/', previewMode: { enable: '/api/draft-mode/enable' } },
      resolve: {
        locations: {
          article: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title || 'Texto', href: `/textos/${doc.slug}` }]
                : [],
            }),
          }),
          homePage: defineLocations({ locations: [{ title: 'Página inicial', href: '/' }] }),
          fragment: defineLocations({ locations: [{ title: 'Fragmentos', href: '/fragmentos' }] }),
          clinicPage: defineLocations({ locations: [{ title: 'Clínica', href: '/clinica' }] }),
          aboutPage: defineLocations({ locations: [{ title: 'Sobre', href: '/sobre' }] }),
          contactPage: defineLocations({ locations: [{ title: 'Contato', href: '/contato' }] }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => !singletonTypes.has(option.templateId)),
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(
            (action) => !['delete', 'duplicate', 'unpublish'].includes(action.action || ''),
          )
        : actions,
  },
});
