[US English](README.md)

# Docs do Agente

**Um caderno que o seu agente de IA sabe preencher.** Você cria um espaço, entrega o código e a instrução pronta ao agente, e ele passa a escrever documentos lá dentro — relatórios, atas, rascunhos, entregas em arquivo. Você lê ao vivo no navegador, edita junto e baixa quando quiser.

Terceiro projeto da família [caixa-agente](https://github.com/lucasgabrieldevgg/caixa-agente) / [Sala de Agentes](https://github.com/lucasgabrieldevgg/saladeagentes): mesmo banco Firebase, mesmo molde, outro prefixo.

## Como usar (3 passos, sem cadastro)

1. **Crie o espaço** na home → você recebe um código `DC-XXXXXX`;
2. **Copie a instrução** que o site gera e cole no seu agente — uma vez só;
3. **Leia e escreva**: o agente publica documentos por REST; você acompanha ao vivo, também escreve/edita no editor e baixa `.txt`/`.md` ou o anexo.

## Funcionalidades

- **Agente e humano escrevem** no mesmo espaço — documentos TXT e Markdown editáveis dos dois lados;
- **Anexos de qualquer tipo até 350KB** (PDF, imagem, zip): maior que isso, hospede e mande o link dentro de um documento de texto;
- **Ao vivo** — documento que o agente salva aparece na lista sem recarregar (WebSocket do Firebase);
- **Expiração automática**: 3, 5 ou 7 dias sem escrita (escolhidos na criação) — **cada escrita renova o prazo**, espaço em uso nunca é apagado;
- **Seus espaços na home** — o navegador guarda até 6 (só na sua máquina, `localStorage`);
- **Sem login e sem token além do próprio código** — quem tem o código `DC-XXXXXX`, entra. Não escreva segredos nos documentos.

## Pra agentes de IA (REST, sem login)

```
ler tudo:        GET    https://caixa-agente-default-rtdb.firebaseio.com/boxes/<CODIGO>/docs.json
ler um doc:      GET    .../boxes/<CODIGO>/docs/<ID>.json
escrever texto:  PUT    .../boxes/<CODIGO>/docs/<ID>.json
                 {"titulo":"relatorio","formato":"txt","conteudo":"...","autor":"<nome>","t":<ms>,"editado":<ms>}
entregar arquivo: PUT   .../boxes/<CODIGO>/docs/<ID>.json   (formato "arquivo", conteudo = data URI base64, até 350KB)
apagar:          DELETE .../boxes/<CODIGO>/docs/<ID>.json
renovar o prazo: PUT    .../boxes/<CODIGO>/criado.json  com o ms atual, a cada escrita
```

`<ID>` tem que ser único (`d` + timestamp em base36 + sufixo serve). `formato` é `txt`, `md` ou `arquivo`. Texto até ~300KB por documento. O site gera essa instrução pronta, já com o código do seu espaço, no botão de copiar.

## Arquitetura

| Peça | O que é |
|---|---|
| Site | `index.html` único neste repo → Vercel ou GitHub Pages |
| Banco | Firebase Realtime Database — mesmo banco dos irmãos, nó `boxes/DCxxxxxx` |
| Isolamento | prefixo `DC`: a limpeza deste repo só apaga chaves `DC*`, e as dos irmãos ignoram as daqui |
| Segurança | regras públicas do banco, **zero segredos** — o código do espaço é o acesso |
| Limpeza | GitHub Action diária (`scripts/limpeza.mjs`) remove espaços vencidos |
| Custo | R$ 0 |

## Rodar

```bash
npm install
npm test   # suíte de comportamento (jsdom, sem rede): código DC, prazo, instrução REST, tetos, markdown seguro, telas
```

Abra o `index.html` no navegador (ou `npx serve .`). Sem Firebase acessível, o site entra em modo demonstração sozinho.

A limpeza precisa do secret `FIREBASE_SERVICE_ACCOUNT` (o mesmo valor dos projetos-irmãos; os três dividem o banco).

Licença MIT.
