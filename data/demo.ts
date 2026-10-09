import credits from './photo-credits.json';
import type {
  About,
  Article,
  Clinic,
  Contact,
  EditorialPhoto,
  Fragment,
  Home,
  Settings,
  Topic,
  Body,
} from '../src/lib/types';
export const photos: EditorialPhoto[] = credits.map((photo) => ({
  _type: 'editorialImage',
  localPath: photo.file,
  alt: photo.alt,
  photographer: photo.photographer,
  sourceUrl: photo.source,
  license: photo.license,
  licenseUrl: photo.licenseUrl,
  credit: photo.changes,
}));
const photo = (name: string) => photos.find((p) => p.localPath?.includes(name))!;
const paragraph = (text: string, index: number, style = 'normal') => ({
  _type: 'block' as const,
  _key: `p${index}`,
  style,
  markDefs: [],
  children: [{ _type: 'span' as const, _key: `s${index}`, text, marks: [] }],
});
const bodies: string[][] = [
  [
    'Uma cidade não se resume às suas ruas. Ela também se faz dos percursos que repetimos, dos lugares que evitamos, das esquinas em que alguma coisa nos chama a atenção. Entre o mapa e o caminho vivido, há sempre uma diferença.',
    'No deslocamento cotidiano, o sujeito encontra outros ritmos: a pressa de quem atravessa, a demora do semáforo, o silêncio improvável de uma passagem. Não se trata apenas de chegar. Há algo que acontece enquanto se caminha.',
    'O que passa despercebido',
    'Talvez seja possível pensar a cidade a partir desses pequenos intervalos. Uma conversa ouvida pela metade. Um rosto que lembra outro. Uma ausência no lugar de sempre. Aquilo que não entra no planejamento também participa da experiência.',
    'A escrita começa aqui como exercício de atenção. Este é um texto demonstrativo, preparado para apresentar a experiência de leitura do site. Seu conteúdo deve ser substituído por um ensaio de Rafael Rodrigues antes da publicação autoral.',
  ],
  [
    'Certos dias parecem repetir o anterior. O mesmo trajeto, o mesmo horário, a frase que retorna sem que se tenha decidido pronunciá-la. Mas a repetição nunca é uma cópia perfeita: alguma diferença se insinua.',
    'O tempo dos relógios organiza os encontros. Já o tempo de uma lembrança não obedece à mesma medida. Um instante pode permanecer por anos; uma longa temporada pode se condensar em uma imagem.',
    'Entre um dia e outro',
    'Perceber o que volta talvez exija uma pausa. A pergunta não precisa encontrar uma resposta imediata. Às vezes, nomear de outro modo o que parecia conhecido já modifica a escuta.',
    'Texto demonstrativo para revisão e substituição. Não representa um texto publicado ou uma afirmação clínica de Rafael Rodrigues.',
  ],
  [
    'Nem tudo o que importa encontra uma palavra de imediato. Há pausas no meio de uma frase, lembranças que chegam incompletas, histórias das quais conhecemos apenas um trecho.',
    'Uma lacuna pode produzir incômodo. Pode também dar lugar a uma pergunta. Entre preencher apressadamente um vazio e permanecer um pouco diante dele, existem diferentes modos de ouvir.',
    'O espaço entre as palavras',
    'Na página, o branco permite que a leitura respire. Na conversa, um intervalo pode mudar o sentido do que veio antes. Não se trata de fazer do silêncio uma regra, mas de perceber sua presença.',
    'Texto de demonstração preparado exclusivamente para apresentar o projeto editorial. Substituir por conteúdo autoral antes da publicação definitiva.',
  ],
  [
    'Em uma passagem coberta, o ritmo da rua parece mudar. A luz chega por outra direção. Os passos ganham um som diferente. Ainda estamos na cidade, mas o espaço oferece outra maneira de estar.',
    'Dentro e fora não são apenas posições num mapa. Um lugar pode acolher e, ao mesmo tempo, lembrar a distância. Uma janela aproxima a paisagem enquanto marca um limite.',
    'Este texto é uma amostra editorial. Substituir pelo ensaio autoral antes da publicação definitiva.',
  ],
  [
    'Há uma conversa entre o que se lê e aquilo que se encontra no caminho. Uma frase acompanha a volta para casa. Uma cena da rua faz lembrar uma página. A leitura continua depois que o livro se fecha.',
    'Esse caderno reúne a possibilidade de registrar encontros assim, sem a obrigação de concluir cada ideia. Algumas observações pedem tempo.',
    'Texto de demonstração, a ser substituído por uma publicação autoral.',
  ],
];
const topics: Topic[] = ['Cidade', 'Psicanálise', 'Cotidiano', 'Cultura', 'Leituras'].map(
  (title, index) => ({
    _id: `topic-${index}`,
    title,
    slug: { current: ['cidade', 'psicanalise', 'cotidiano', 'cultura', 'leituras'][index] },
  }),
);
const titles = [
  'O sujeito na cidade',
  'Tempo e repetição',
  'Lacunas',
  'Entre o dentro e o fora',
  'O que fica de uma leitura',
];
const slugs = [
  'o-sujeito-na-cidade',
  'tempo-e-repeticao',
  'lacunas',
  'entre-o-dentro-e-o-fora',
  'o-que-fica-de-uma-leitura',
];
const images = ['avenida-paulista', 'copan', 'sujeito-cidade', 'galeria-centro', 'viaduto-cha'];
const excerpts = [
  'Os percursos que fazemos e aquilo que nos atravessa.',
  'Sobre os dias que se repetem e as diferenças que insistem.',
  'Uma pausa entre o que se diz e o que ainda não tem nome.',
  'Passagens, limites e outras maneiras de habitar.',
  'Quando uma frase continua a caminhar conosco.',
];
const articles: Article[] = titles.map((title, i) => ({
  _id: `demo-article-${i}`,
  title,
  slug: { current: slugs[i] },
  excerpt: excerpts[i],
  subtitle: excerpts[i],
  publishedAt: `2026-09-${String(25 - i * 4).padStart(2, '0')}T12:00:00Z`,
  topic: topics[i % topics.length],
  heroImage: photo(images[i]),
  body: bodies[i].map((text, j) => paragraph(text, j, text.length < 40 ? 'h2' : 'normal')) as Body,
  demo: true,
}));
const fragments: Fragment[] = [
  {
    _id: 'demo-fragment-0',
    text: 'A cidade\ntambém habita.',
    publishedAt: '2026-09-24T12:00:00Z',
    topic: topics[0],
    demo: true,
  },
  {
    _id: 'demo-fragment-1',
    text: 'Há perguntas que caminham conosco.',
    publishedAt: '2026-09-20T12:00:00Z',
    topic: topics[1],
    image: photo('galeria-centro'),
    demo: true,
  },
  {
    _id: 'demo-fragment-2',
    text: 'Às vezes, o intervalo é a parte da conversa que permanece.',
    publishedAt: '2026-09-16T12:00:00Z',
    topic: topics[2],
    demo: true,
  },
];
const settings: Settings = {
  nome: 'Rafael Rodrigues',
  descricaoDoSite:
    'Psicanálise, cidade e palavra. Um espaço para a escrita, a escuta e o pensamento.',
  seoTitle: 'Rafael Rodrigues — Psicanálise, cidade e palavra',
  seoDescription:
    'Textos, fragmentos e reflexões entre a psicanálise e a vida urbana. Conheça a publicação de Rafael Rodrigues.',
};
const home: Home = {
  heroTitle: 'Psicanálise,\ncidade e palavra',
  heroSubtitle: 'Escuta, pensamento\ne vida urbana.',
  heroImage: photo('estacao-luz'),
  heroPrimaryCTA: 'Ler',
  heroSecondaryCTA: 'Clínica',
  featuredArticles: articles.slice(0, 3),
  featuredFragments: fragments.slice(0, 2),
  clinicTitle: 'Clínica',
  clinicShortText: 'Atendimento psicanalítico\npresencial e online.',
  clinicImage: photo('galeria-centro'),
};
const clinic: Clinic = {
  title: 'Clínica',
  intro: 'Um espaço para a palavra.\nUm tempo para a escuta.',
  modalities: ['Presencial', 'Online'],
  city: 'São Paulo',
  clinicImage: photo('galeria-centro'),
  body: [
    paragraph(
      'A clínica é um lugar dedicado à escuta de cada percurso. O primeiro contato pode ser feito para conversar sobre a possibilidade de atendimento, os horários e a modalidade.',
      0,
    ),
    paragraph(
      'Texto de apresentação demonstrativo. Rafael deverá revisar as informações da clínica e das modalidades antes de divulgar o site.',
      1,
    ),
  ] as Body,
  contactText:
    'Para conversar sobre atendimento, entre em contato. Não é necessário compartilhar informações pessoais de saúde nesta primeira mensagem.',
  whatsappCTA: 'Entrar em contato',
};
const about: About = {
  title: 'Rafael Rodrigues',
  intro: 'Entre a escuta\ne a escrita.',
  biography: [
    paragraph(
      'Este espaço reúne textos, fragmentos e a apresentação da prática em psicanálise de Rafael Rodrigues.',
      0,
    ),
    paragraph(
      'Biografia a ser preenchida por Rafael: conte aqui seu percurso, os encontros com a psicanálise e as perguntas que orientam sua escrita e sua escuta.',
      1,
    ),
    paragraph(
      'As informações de formação, instituições, grupos de estudo e supervisão devem ser adicionadas após confirmação. Nenhuma credencial foi presumida neste projeto.',
      2,
    ),
  ] as Body,
};
const contact: Contact = {
  title: 'Contato',
  intro: 'Uma conversa pode começar\ncom algumas palavras.',
  formEnabled: true,
};
export const demoContent = { settings, home, articles, fragments, topics, clinic, about, contact };
