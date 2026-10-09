import { defineArrayMember, defineField, defineType } from 'sanity';
const required = <T extends { required(): T }>(rule: T) => rule.required();
const title = () =>
  defineField({ name: 'title', title: 'Título', type: 'string', validation: required });
const intro = () =>
  defineField({
    name: 'intro',
    title: 'Introdução',
    type: 'text',
    rows: 3,
    description: 'Um convite breve à leitura.',
  });
const photo = (name: string, label: string, mandatory = false) =>
  defineField({
    name,
    title: label,
    type: 'editorialImage',
    ...(mandatory ? { validation: required } : {}),
  });
const body = (name = 'body', label = 'Conteúdo') =>
  defineField({ name, title: label, type: 'richText' });
const seo = () => defineField({ name: 'seo', title: 'Como aparece nas buscas', type: 'seo' });
const topic = () =>
  defineField({ name: 'topic', title: 'Tema', type: 'reference', to: [{ type: 'topic' }] });
const publishedAt = () =>
  defineField({
    name: 'publishedAt',
    title: 'Data',
    type: 'datetime',
    initialValue: () => new Date().toISOString(),
    validation: required,
    description: 'Data de publicação. Datas futuras ficam ocultas até o horário escolhido.',
  });
const email = (name = 'email', label = 'E-mail') =>
  defineField({ name, title: label, type: 'string', validation: (rule) => rule.email() });
const whatsapp = () =>
  defineField({
    name: 'whatsapp',
    title: 'WhatsApp',
    type: 'string',
    description: 'Inclua país e DDD. Exemplo de formato: +55 11 99999-9999.',
    validation: (rule) =>
      rule.custom(
        (value) =>
          !value ||
          (String(value).replace(/\D/g, '').length >= 10 &&
            String(value).replace(/\D/g, '').length <= 15) ||
          'Informe o número com país e DDD.',
      ),
  });
const slug = (mandatory = true) =>
  defineField({
    name: 'slug',
    title: 'Endereço do texto',
    type: 'slug',
    options: { source: 'title', maxLength: 96 },
    description: 'Clique em Gerar depois de escrever o título. Evite alterar depois de publicar.',
    ...(mandatory ? { validation: required } : {}),
  });
const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'Título para buscas',
    type: 'string',
    group: 'seo',
    validation: (r) => r.max(70).warning('Prefira até 70 caracteres.'),
  }),
  defineField({
    name: 'seoDescription',
    title: 'Descrição para buscas',
    type: 'text',
    rows: 3,
    group: 'seo',
    validation: (r) => r.max(160).warning('Prefira até 160 caracteres.'),
  }),
  { ...photo('ogImage', 'Imagem de compartilhamento'), group: 'seo' },
];
export const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'clinicPage',
  'aboutPage',
  'contactPage',
]);
export const schemaTypes = [
  defineType({
    name: 'editorialImage',
    title: 'Fotografia',
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Descrição da imagem',
        type: 'string',
        description: 'Descreva o que aparece na fotografia para quem usa leitor de tela.',
        validation: (r) => r.required(),
      }),
      defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
      defineField({ name: 'photographer', title: 'Fotógrafo(a)', type: 'string' }),
      defineField({ name: 'credit', title: 'Crédito', type: 'string' }),
      defineField({
        name: 'sourceUrl',
        title: 'Link da fonte',
        type: 'url',
        validation: (r) => r.uri({ scheme: ['http', 'https'] }),
      }),
      defineField({
        name: 'license',
        title: 'Licença de uso',
        type: 'string',
        description: 'Informe a licença quando a fotografia não for de sua autoria.',
      }),
      defineField({
        name: 'licenseUrl',
        title: 'Link da licença',
        type: 'url',
        validation: (r) => r.uri({ scheme: ['http', 'https'] }),
      }),
    ],
    description:
      'Envie uma fotografia. Use Recortar e Ponto de interesse para ajustar o enquadramento; a apresentação será em preto e branco.',
  }),
  defineType({
    name: 'richText',
    title: 'Texto',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Parágrafo', value: 'normal' },
          { title: 'Subtítulo', value: 'h2' },
          { title: 'Subtítulo menor', value: 'h3' },
          { title: 'Citação', value: 'blockquote' },
        ],
        marks: {
          decorators: [
            { title: 'Negrito', value: 'strong' },
            { title: 'Itálico', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({
                  name: 'href',
                  title: 'Endereço',
                  type: 'url',
                  validation: (r) =>
                    r.uri({ allowRelative: true, scheme: ['https', 'http', 'mailto'] }),
                }),
              ],
            },
          ],
        },
        lists: [
          { title: 'Lista', value: 'bullet' },
          { title: 'Lista numerada', value: 'number' },
        ],
      }),
      defineArrayMember({ type: 'editorialImage' }),
    ],
  }),
  defineType({
    name: 'seo',
    title: 'Buscas e compartilhamento',
    type: 'object',
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: 'title', title: 'Título', type: 'string' }),
      defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 3 }),
      photo('image', 'Imagem de compartilhamento'),
    ],
  }),
  defineType({
    name: 'topic',
    title: 'Tema',
    type: 'document',
    fields: [
      title(),
      slug(),
      defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 3 }),
    ],
  }),
  defineType({
    name: 'article',
    title: 'Texto',
    type: 'document',
    groups: [
      { name: 'content', title: 'Texto', default: true },
      { name: 'seo', title: 'Buscas e compartilhamento' },
    ],
    fields: [
      ...[
        title(),
        defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string' }),
        topic(),
        publishedAt(),
        photo('heroImage', 'Imagem principal', true),
        defineField({
          name: 'excerpt',
          title: 'Resumo',
          type: 'text',
          rows: 3,
          description: 'Uma apresentação curta do texto para o arquivo e a busca.',
          validation: (r) => r.max(320),
        }),
        body(),
        slug(),
        defineField({
          name: 'featured',
          title: 'Destaque editorial',
          type: 'boolean',
          initialValue: false,
          description: 'Uma marca de organização. Escolha os textos da capa em Página inicial.',
        }),
        defineField({
          name: 'demo',
          title: 'Conteúdo demonstrativo',
          type: 'boolean',
          initialValue: false,
          description: 'Desative depois de substituir o texto de exemplo por um texto autoral.',
        }),
      ].map((field) => ({ ...field, group: 'content' })),
      ...seoFields,
    ],
    preview: {
      select: { title: 'title', media: 'heroImage', topic: 'topic.title', date: 'publishedAt' },
      prepare({ title, media, topic, date }) {
        return {
          title,
          media,
          subtitle: [
            topic,
            date
              ? new Date(date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
              : 'Sem data',
          ]
            .filter(Boolean)
            .join(' · '),
        };
      },
    },
  }),
  defineType({
    name: 'fragment',
    title: 'Fragmento',
    type: 'document',
    fieldsets: [
      {
        name: 'optional',
        title: 'Informações opcionais',
        options: { collapsible: true, collapsed: true },
      },
    ],
    fields: [
      defineField({
        name: 'text',
        title: 'Fragmento',
        type: 'text',
        rows: 5,
        validation: required,
      }),
      publishedAt(),
      ...[
        topic(),
        defineField({
          name: 'source',
          title: 'Fonte',
          type: 'string',
          description: 'Livro, publicação ou outra fonte, quando houver.',
        }),
        defineField({
          name: 'author',
          title: 'Autor(a)',
          type: 'string',
          description: 'Preencha somente quando a autoria for conhecida. Não é obrigatório.',
        }),
        photo('image', 'Fotografia'),
        defineField({ name: 'featured', title: 'Destaque editorial', type: 'boolean' }),
        slug(false),
        defineField({
          name: 'demo',
          title: 'Conteúdo demonstrativo',
          type: 'boolean',
          initialValue: false,
        }),
      ].map((field) => ({ ...field, fieldset: 'optional' })),
    ],
    preview: { select: { title: 'text', subtitle: 'publishedAt', media: 'image' } },
  }),
  defineType({
    name: 'siteSettings',
    title: 'Identidade e contato',
    type: 'document',
    groups: [
      { name: 'identity', title: 'Identidade', default: true },
      { name: 'seo', title: 'SEO' },
      { name: 'contact', title: 'Redes e contato' },
    ],
    fields: [
      defineField({
        name: 'nome',
        title: 'Nome',
        type: 'string',
        initialValue: 'Rafael Rodrigues',
        group: 'identity',
        validation: required,
      }),
      ...[
        photo('logoHorizontal', 'Logo horizontal'),
        photo('monograma', 'Monograma'),
        defineField({ name: 'descricaoDoSite', title: 'Descrição do site', type: 'text', rows: 3 }),
      ].map((field) => ({ ...field, group: 'identity' })),
      ...[
        email(),
        whatsapp(),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({
          name: 'enderecoOpcional',
          title: 'Endereço (opcional)',
          type: 'text',
          rows: 2,
        }),
      ].map((field) => ({ ...field, group: 'contact' })),
      ...seoFields,
    ],
  }),
  defineType({
    name: 'homePage',
    title: 'Página inicial',
    type: 'document',
    groups: [
      { name: 'hero', title: 'Abertura', default: true },
      { name: 'curation', title: 'Curadoria' },
      { name: 'clinic', title: 'Clínica' },
      { name: 'seo', title: 'Buscas' },
    ],
    fields: [
      ...[
        defineField({
          name: 'heroTitle',
          title: 'Título de abertura',
          type: 'text',
          rows: 2,
          initialValue: 'Psicanálise,\ncidade e palavra',
          validation: required,
        }),
        defineField({
          name: 'heroSubtitle',
          title: 'Texto breve',
          type: 'text',
          rows: 2,
          initialValue: 'Escuta, pensamento\ne vida urbana.',
        }),
        photo('heroImage', 'Fotografia de abertura', true),
        defineField({
          name: 'heroGallery',
          title: 'Fotografias adicionais da abertura',
          type: 'array',
          of: [defineArrayMember({ type: 'editorialImage' })],
          validation: (rule) => rule.max(4),
          description:
            'A fotografia principal aparece primeiro. Adicione até quatro imagens para a troca suave ao fundo; a brush azul permanece fixa. Quando vazio, usamos também as fotografias dos dois primeiros textos destacados.',
        }),
        defineField({
          name: 'heroPrimaryCTA',
          title: 'Botão de leitura',
          type: 'string',
          initialValue: 'Ler',
        }),
        defineField({
          name: 'heroSecondaryCTA',
          title: 'Botão da clínica',
          type: 'string',
          initialValue: 'Clínica',
        }),
      ].map((field) => ({ ...field, group: 'hero' })),
      defineField({
        name: 'featuredArticles',
        title: 'Textos da capa',
        type: 'array',
        group: 'curation',
        of: [defineArrayMember({ type: 'reference', to: [{ type: 'article' }] })],
        validation: (r) => r.max(3).unique(),
        description: 'Escolha até 3 textos e arraste para definir a ordem.',
      }),
      defineField({
        name: 'featuredFragments',
        title: 'Fragmentos da capa',
        type: 'array',
        group: 'curation',
        of: [defineArrayMember({ type: 'reference', to: [{ type: 'fragment' }] })],
        validation: (r) => r.max(3).unique(),
        description: 'Escolha até 3 fragmentos. A autoria é opcional.',
      }),
      ...[
        defineField({
          name: 'clinicTitle',
          title: 'Título',
          type: 'string',
          initialValue: 'Clínica',
        }),
        defineField({ name: 'clinicShortText', title: 'Texto breve', type: 'text', rows: 3 }),
        photo('clinicImage', 'Fotografia da clínica'),
      ].map((field) => ({ ...field, group: 'clinic' })),
      defineField({
        name: 'homepageSEO',
        title: 'Buscas e compartilhamento',
        type: 'seo',
        group: 'seo',
      }),
    ],
  }),
  defineType({
    name: 'clinicPage',
    title: 'Clínica',
    type: 'document',
    fields: [
      title(),
      defineField({
        name: 'heroTitle',
        title: 'Título de abertura',
        type: 'text',
        rows: 3,
        description: 'As quebras de linha são preservadas na abertura da página.',
        initialValue: 'Um espaço\npara escutar\no que insiste.',
      }),
      photo('heroImage', 'Fotografia de destaque — abertura'),
      defineField({
        name: 'heroQuote',
        title: 'Frase do painel de vidro',
        type: 'text',
        rows: 3,
        initialValue: 'Nem tudo o que sentimos se explica. Mas pode ser escutado.',
      }),
      defineField({
        name: 'heroQuoteCaption',
        title: 'Legenda do painel de vidro',
        type: 'string',
        initialValue: 'A clínica como possibilidade de outra narrativa.',
      }),
      intro(),
      body(),
      defineField({
        name: 'modalities',
        title: 'Modalidades de atendimento',
        type: 'array',
        of: [defineArrayMember({ type: 'string' })],
        initialValue: ['Presencial', 'Online'],
      }),
      defineField({ name: 'city', title: 'Cidade', type: 'string' }),
      photo('clinicImage', 'Fotografia complementar — atendimento'),
      defineField({
        name: 'contactText',
        title: 'Orientação para o primeiro contato',
        type: 'text',
        rows: 3,
      }),
      defineField({
        name: 'whatsappCTA',
        title: 'Texto do link de contato',
        type: 'string',
        initialValue: 'Entrar em contato',
      }),
      seo(),
    ],
  }),
  defineType({
    name: 'aboutPage',
    title: 'Sobre',
    type: 'document',
    fields: [
      title(),
      intro(),
      photo('portrait', 'Retrato (opcional)'),
      body('biography', 'Biografia'),
      defineField({
        name: 'trainingItems',
        title: 'Formação e percurso',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              title(),
              defineField({
                name: 'detail',
                title: 'Instituição, período ou descrição',
                type: 'text',
                rows: 3,
              }),
            ],
          }),
        ],
      }),
      defineField({
        name: 'additionalSections',
        title: 'Outras seções',
        type: 'array',
        of: [defineArrayMember({ type: 'object', fields: [title(), body()] })],
        description: 'Grupos de estudo, supervisão ou publicações, se desejar.',
      }),
      seo(),
    ],
  }),
  defineType({
    name: 'contactPage',
    title: 'Contato',
    type: 'document',
    fields: [
      title(),
      intro(),
      email(),
      whatsapp(),
      defineField({
        name: 'formEnabled',
        title: 'Exibir formulário',
        type: 'boolean',
        initialValue: true,
        description:
          'O formulário abre uma mensagem de e-mail quando o envio direto não está configurado.',
      }),
      email('formRecipient', 'E-mail que recebe as mensagens'),
      seo(),
    ],
  }),
];
