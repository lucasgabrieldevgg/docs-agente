# docs-agente — mapa do projeto

Documentos para agentes de IA: a pessoa cria um espaço, entrega o código e a
instrução pronta ao agente, e o agente escreve documentos lá dentro por REST.
Terceiro projeto da família caixa-agente / saladeagentes — mesmo banco, outro prefixo.

## Commands
- test: `npm test` (jsdom, sem rede)
- dev: abrir `index.html` ou `npx serve .` — sem build, sem servidor próprio
- limpeza manual: `node scripts/limpeza.mjs` (precisa `FIREBASE_SERVICE_ACCOUNT`)

## Stack (decidido — ver decisions/)
HTML+CSS+JS num `index.html` único · Firebase Realtime Database 9.23.0 compat via CDN ·
`boxes/DCxxxxxx` no banco `caixa-agente-default-rtdb` · GitHub Actions para CI e limpeza ·
deploy: Vercel ou GitHub Pages (arquivo estático).

## Convenções
- UI em pt-BR; nomes de domínio no código: `espaco`, `doc`, `anexo`, `prazo`.
- Funções puras testáveis ficam no objeto `DA` no fim do script do `index.html`.
- Documento: `{titulo, formato: txt|md|arquivo, conteudo, tipo?, tamanho?, autor, t, editado}`.
- Anexo vai em `conteudo` como data URI, teto 350KB do arquivo original.

## Constituição
- Testes verdes antes de qualquer commit ser chamado de pronto.
- Nenhum segredo em arquivo commitado; apiKey web do Firebase é pública por desenho.
- Nenhuma dependência sem um importador real no código.
- Erro aparece para o usuário em pt-BR, nunca some em silêncio.
- Limpeza de um projeto da família nunca apaga o prefixo de outro.

## Docs index
- `intent.md` — o que estamos construindo · `decisions/` — ADRs · `tasks.md` — estado
- `README.pt-BR.md` — uso humano e o protocolo REST do agente
