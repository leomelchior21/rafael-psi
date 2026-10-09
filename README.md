# Rafael Rodrigues — Psicanálise, cidade e palavra

Publicação editorial em português, com Next.js App Router, TypeScript e Sanity Studio integrado em `/studio`. A identidade oficial fornecida é preservada; fotografias reais de São Paulo são apresentadas em preto e branco. Todo conteúdo publicado, curadoria e fotografia editorial vêm do Sanity.

## Desenvolvimento

Requisitos: Node.js **22.12+** e npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

No PowerShell, use `Copy-Item .env.example .env.local`. Acesse `http://localhost:3000`; o estúdio funciona em `http://localhost:3000/studio`, no mesmo servidor.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Testes de navegação: `npx playwright install chromium` e `npm run test:e2e`. Eles usam o conteúdo inicial, um servidor na porta 3000 e cobrem desktop e celular. Screenshots e relatórios ficam fora do Git.

## Variáveis de ambiente

| Variável                        | Finalidade                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `svrzh6fe`                                                                    |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`                                                                  |
| `NEXT_PUBLIC_SITE_URL`          | URL pública final, com HTTPS; usada em canonical, sitemap e compartilhamento  |
| `SANITY_API_READ_TOKEN`         | Token **Viewer**, somente no servidor, para pré-visualizar rascunhos          |
| `SANITY_API_WRITE_TOKEN`        | Token **Editor** usado apenas na importação inicial. Remover depois           |
| `DEMO_MODE`                     | `true` permite uma prévia local explícita antes da importação. Padrão `false` |
| `RESEND_API_KEY`                | Opcional: entrega de mensagens por e-mail via Resend                          |
| `CONTACT_FROM_EMAIL`            | Remetente em domínio verificado no Resend                                     |

Versão explícita da API Sanity: `2026-10-01`. Nunca coloque tokens em variáveis `NEXT_PUBLIC_*`, no Git ou em arquivos públicos. `.env.local` é ignorado. O token de leitura é passado ao navegador **somente na sessão autenticada de pré-visualização**, pelo mecanismo oficial do `next-sanity`.

## Sanity e conteúdo inicial

Projeto existente: **svrzh6fe**, dataset **production**. Não é necessário criar outro projeto. Os esquemas TypeScript estão em `src/sanity/schema.ts` e a organização editorial em `sanity.config.ts`.

1. Em [Sanity Manage](https://www.sanity.io/manage/project/svrzh6fe), adicione o usuário editor e confirme o acesso ao dataset.
2. Em **API → CORS origins**, adicione `http://localhost:3000` e o domínio de produção com **Allow credentials** ativado. Adicione apenas origens de prévia que você realmente utiliza.
3. Para importar as fotografias e os exemplos, crie um token Editor e coloque-o em `SANITY_API_WRITE_TOKEN` em `.env.local`.
4. Execute `npm run seed`. O importador usa `createIfNotExists`, IDs estáveis e preserva documentos já existentes. Os assets de imagem são deduplicados por Sanity. Referências, créditos e licenças acompanham as imagens.
5. Remova o token de escrita do ambiente. Ele não é necessário para editar pelo Studio.

Os textos e fragmentos iniciais estão marcados como **demonstrativos**. A biografia informa explicitamente o que precisa ser preenchido. Não foram inventadas credenciais, citações atribuídas a pessoas reais ou imagens de São Paulo. O contato permanece provisório até a inclusão dos dados reais.

O frontend nunca troca silenciosamente para conteúdo de exemplo caso o Sanity falhe. `DEMO_MODE=true` é uma opção explícita de desenvolvimento e mostra um aviso. Em produção, desative-o. O site vazio exibe estados apropriados; erros de conexão exibem a tela de tentar novamente.

## Pré-visualização e publicação

Para ativar a aba **Pré-visualizar**, configure um token Viewer em `SANITY_API_READ_TOKEN`, as origens CORS e reinicie o servidor. A apresentação usa Draft Mode validado pela Sanity, `defineLive` e Visual Editing. Sem o token, o site público e a edição continuam disponíveis, mas a pré-visualização autenticada mostra uma mensagem de configuração pendente.

Alterações publicadas são consultadas pela integração `next-sanity/live`. A edição de conteúdo não exige acesso ao código ou um novo deploy. Publicações com datas futuras são filtradas por data. Para publicação editorial agendada com evento no horário exato, use o recurso de agendamento do plano Sanity; não trate um campo de data como substituto de um agendador.

## Deploy na Vercel

1. Importe este repositório no painel da Vercel; framework **Next.js**, raiz do projeto `.`.
2. Use Node.js 22.12+ ou 24, comando de instalação `npm ci` e build `npm run build`.
3. Configure as variáveis públicas acima; `NEXT_PUBLIC_SITE_URL` deve ser o domínio definitivo, sem barra final. Configure o token Viewer somente se quiser prévia de rascunhos.
4. Configure CORS no Sanity para esse domínio e faça o deploy.
5. Verifique `/studio`, `/sitemap.xml`, `/robots.txt`, uma página de texto e o contato.

Não há dependência de um serviço de banco de dados adicional. O Studio autentica os editores pelo Sanity; visitantes acessam apenas o conteúdo publicado. O deploy e a configuração de domínio/conta são separados do push do código para GitHub.

## Contato

Os dados reais são editados em **Páginas → Contato** ou em **Configurações → Redes e contato**. Até lá, a página mostra `Lorem ipsum` e informa que o contato está em preparação. Nenhuma mensagem é considerada enviada.

Com e-mail real e sem Resend, **Preparar mensagem** abre o aplicativo de e-mail da pessoa, com os campos preenchidos. A interface informa que é preciso concluir o envio nesse aplicativo. WhatsApp aparece apenas quando um número válido com país e DDD é configurado.

Para envio direto, configure um remetente verificado e `RESEND_API_KEY` / `CONTACT_FROM_EMAIL`. O destinatário vem do campo **E-mail que recebe as mensagens** no Studio; não é enviado pelo navegador. A API valida campos, origem e tamanho da requisição, tem campo antispam e limite básico por instância (4 envios a cada 15 minutos). Em produção com múltiplas instâncias, configure também um limite compartilhado no firewall/edge do provedor. O formulário não pede histórico clínico e não armazena mensagens em banco. Reveja a página de privacidade antes da divulgação de acordo com os procedimentos reais do responsável.

## Imagens e identidade

- `public/brand/logo-horizontal.svg` e `monogram.svg`: contêineres SVG com o PNG original incorporado, sem redesenhar a marca. Podem ser substituídos por vetores oficiais com as mesmas proporções.
- O logo também pode ser substituído pelo Studio. O cabeçalho escuro usa a versão visual clara da marca.
- `public/brand/ink-texture.webp`: recorte sem texto da textura da referência fornecida.
- `public/brand/hero-brush.webp`: pintura azul transparente da abertura, fixa acima das fotografias. Origem e prompt em [data/hero-brush.md](data/hero-brush.md).
- `public/images/retrato-provisorio.webp`: retrato ilustrativo temporário em Sobre, substituído pelo campo Retrato do Sanity. Origem e prompt em [data/retrato-provisorio.md](data/retrato-provisorio.md).
- `data/photo-credits.json`: fontes, autores, licenças e alterações das seis fotografias reais.
- `/creditos`: créditos gerados a partir das imagens efetivamente usadas no CMS. A conversão em WebP, o recorte e a apresentação monocromática são informados. Fotografias CC BY-SA conservam suas licenças; isso não altera a licença do restante do site.
- `EditorialImage` usa `next/image` e `@sanity/image-url`, com crop/hotspot, tamanhos responsivos e carregamento prioritário só acima da dobra. O preto e branco é aplicado via CSS; os originais continuam disponíveis no CMS.
- Instrument Serif e DM Sans são hospedadas localmente pelos pacotes Fontsource. Licenças SIL OFL incluídas em `public/fonts/licenses`.

## Guia rápido para Rafael

### Entrar no estúdio

Abra o endereço do site seguido de `/studio` e entre com sua conta Sanity. Você não precisa acessar GitHub, Vercel ou código para publicar.

### Publicar um texto

1. Abra **Conteúdo → Textos** e clique para criar um **Texto**.
2. Escreva o título, o subtítulo opcional, o tema e a data.
3. Envie a imagem principal. Descreva a imagem e informe o fotógrafo/crédito quando necessário. Em **Recortar**, ajuste o enquadramento e o ponto de interesse.
4. Escreva o resumo e o conteúdo. Use subtítulos, citações, negrito, itálico, links ou imagens quando precisar.
5. No endereço do texto, clique em **Gerar**. Evite mudar o endereço de textos já divulgados.
6. Se estiver substituindo uma amostra, desligue **Conteúdo demonstrativo** após revisar todo o texto.
7. Use **Pré-visualizar**, quando habilitado, e clique em **Publicar**. A área de buscas é opcional: título e resumo já servem como base.

### Publicar um fragmento

Abra **Conteúdo → Fragmentos**, crie um fragmento, escreva e confira a data. Tema, fonte, autoria e fotografia ficam na seção opcional. Não precisa atribuir um autor se não houver uma citação. Clique em **Publicar**.

### Trocar uma fotografia da página inicial

Abra **Páginas → Página inicial → Abertura**, troque a fotografia, descreva a imagem e ajuste o ponto de interesse. Em **Fotografias adicionais da abertura**, você pode escolher até quatro fotos e ordenar as trocas suaves do fundo. A foto principal aparece primeiro; quando a lista adicional está vazia, o fundo também usa as fotos dos dois primeiros textos destacados. A brush azul permanece automaticamente sobre qualquer fotografia. Na aba **Clínica**, você troca a fotografia dessa seção. Publique. A diagramação é mantida automaticamente.

### Escolher os destaques

Em **Páginas → Página inicial → Curadoria**, selecione até três textos e organize os fragmentos. Arraste para definir a ordem. A capa alterna entre os dois primeiros fragmentos selecionados, exibindo um por vez; os demais continuam no arquivo. Publique a página inicial. A capa mantém sua seleção; não é substituída automaticamente pelos textos mais recentes.

### Alterar contato ou redes

Abra **Configurações → Identidade, SEO, redes e contato → Redes e contato**. Atualize e-mail, WhatsApp e links. O número deve incluir `55` e o DDD. Em **Páginas → Contato**, você pode definir os dados específicos dessa página e o e-mail que recebe o formulário. Clique em **Publicar**.

### Atualizar a clínica e o percurso

Use **Páginas → Clínica** e **Páginas → Sobre**. Substitua os textos de apresentação provisórios e acrescente apenas informações confirmadas. Você pode trocar o retrato e omitir formação ou seções adicionais. O layout se adapta.

Até enviar uma foto no campo **Retrato**, Sobre apresenta uma imagem ilustrativa provisória, identificada pela legenda. Ao publicar a fotografia real pelo Studio, ela substitui automaticamente o exemplo. O retrato ilustrativo não é usado nos metadados da pessoa ou na imagem de compartilhamento.

## Referências técnicas

- [Next.js App Router](https://nextjs.org/docs/app)
- [Sanity + Next.js: edição visual](https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router)
- [Configuração CORS do Sanity](https://www.sanity.io/docs/content-lake/cors)

As referências de design originais ficam em `DESIGN-REFERENCE/` para manutenção da identidade.

## Composição e movimento

`src/app/editorial.css` concentra o ritmo editorial, a composição responsiva e os estados de interação. `src/app/hero.css` define as camadas da abertura e os destaques de Textos, com enquadramentos iguais e cantos arredondados. `MotionSystem` controla as entradas por linha, as revelações de capítulos e imagens e a limpeza das animações entre rotas, usando GSAP e ScrollTrigger. Lenis atua apenas em telas acima de 1024 px com mouse; celular e tablet conservam a rolagem nativa. Menus e busca suspendem a rolagem da página.

`HeroSlideshow` alterna as fotografias a cada 6,5 segundos, com uma transição de opacidade de 1,8 segundo. A troca aguarda a imagem seguinte carregar, pausa fora da área visível, com a aba oculta ou com um diálogo aberto, e oferece um botão de pausa. Com movimento reduzido ou prévia de edição, não há troca automática. Sem JavaScript, a primeira fotografia continua visível.

Fragmentos usa a mesma brush espelhada verticalmente sobre uma fotografia de fundo. A seção compacta mostra um fragmento por vez: `FragmentRotator` escreve o texto progressivamente, mantém uma pausa de leitura e troca para o próximo. O espaço reservado evita mudanças de altura, e leitores de tela recebem o texto completo. A animação pausa fora da tela, com a aba oculta, em diálogos, na prévia de edição e pelo botão Pausar. Com movimento reduzido ou sem JavaScript, um fragmento completo permanece visível.

A página de Textos apresenta filtros em uma coluna lateral e cartões com fotografia, título em itálico e tema. Em telas menores, os filtros passam para cima da grade. O fundo de papel e tinta é um asset local (`public/brand/archive-paper.webp`), com o prompt e a origem documentados em `data/archive-paper.md`. Textos, imagens e temas continuam vindo do Sanity. O menu preserva a página ao fundo com desfoque e escurecimento, anima o ícone entre três linhas e um X, e mantém o foco e o bloqueio de rolagem do diálogo nativo.

Com movimento reduzido, a rolagem suave, os recortes animados e a profundidade das imagens são desativados. Todo o conteúdo permanece visível sem JavaScript. A prévia de edição do Sanity também desativa as animações. Schemas, consultas e publicação do CMS permanecem independentes dessa camada visual.

Com o site rodando em `localhost:3000`, `node scripts/refinement-audit.mjs` registra a página e as imagens em 1440, 1280, 1024, 768, 430 e 390 px, além do menu e de um artigo. Os arquivos são salvos em `artifacts/refinement/` e não entram no Git. Os testes de navegador verificam foco, bloqueio da rolagem, movimento reduzido, conteúdo sem JavaScript e os fluxos públicos existentes.

## Manutenção de dependências

O lockfile fixa as versões verificadas. Sharp foi atualizado para 0.35.5; os overrides de `js-yaml`, `smol-toml` e `uuid` evitam versões transitivas com correções de segurança disponíveis. Não execute `npm audit fix --force` sem revisar: a sugestão automática rebaixa Next/Sanity para versões incompatíveis com esta implementação.

Na verificação de 9 de outubro de 2026, restam alertas transitivos de negação de serviço em `braces` e `sprintf-js`, nas cadeias das ferramentas de lint/CLI, sem versão corrigida disponível no registro. Os totais do `npm audit` também contam os pacotes dependentes afetados. Reavalie esses dois pacotes nas próximas atualizações; não há processamento de padrões fornecidos por visitantes nessas ferramentas.
