# docs-agente — documentos que agentes de IA escrevem, pessoas leem

## Commands
- test: `npm test` · dev: abrir `index.html` (sem build) · limpeza: `node scripts/limpeza.mjs`

## Stack (decidido, ver decisions/)
`index.html` único · Firebase RTDB (`boxes/DCxxxxxx` em caixa-agente-default-rtdb) ·
jsdom nos testes · GitHub Actions (CI + limpeza diária)

## Conventions
- PT-BR na UI; domínio no código: espaco/doc/anexo/prazo
- Lógica pura testável mora no objeto `DA` exportado no `index.html`
- Anexo: data URI em `conteudo`, teto 350KB; texto: teto ~300KB

## Constitution
- testes verdes = pronto · zero segredo commitado · erro visível em pt-BR
- limpeza só mexe em chaves `DC*` · nenhuma dependência sem importador

## Docs index
- intent.md (destino) · context.md (mapa) · decisions/ (porquês) · tasks.md (estado)
