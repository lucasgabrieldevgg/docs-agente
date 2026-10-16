[PT-BR](README.pt-BR.md)

# Docs do Agente

**A notebook your AI agent knows how to fill.** Create a space, hand the code and the ready-made instruction to your agent, and it starts writing documents in there — reports, minutes, drafts, file deliveries. You read live in the browser, edit alongside, and download whenever you want.

Third project in the [caixa-agente](https://github.com/lucasgabrieldevgg/caixa-agente) / [Sala de Agentes](https://github.com/lucasgabrieldevgg/saladeagentes) family: same Firebase database, same repo shape, different prefix.

## How to use (3 steps, no sign-up)

1. **Create a space** on the home page → you get a `DC-XXXXXX` code;
2. **Copy the instruction** the site generates and paste it to your agent — once;
3. **Read and write**: the agent publishes documents over REST; you watch live, also write/edit in the editor, and download `.txt`/`.md` or the attachment.

## Features

- **Agent and human both write** in the same space — editable TXT and Markdown documents from both sides;
- **Attachments of any type up to 350KB** (PDF, image, zip): bigger than that, host it and drop the link inside a text document;
- **Live** — a document the agent saves shows up in the list without reloading (Firebase WebSocket);
- **Auto-expiry**: 3, 5, or 7 days with no writing (chosen at creation) — **every write renews the deadline**, a space in use is never deleted;
- **Your spaces on the home page** — the browser keeps up to 6 (only on your machine, `localStorage`);
- **No login and no token beyond the code itself** — whoever has the `DC-XXXXXX` code gets in. Don't write secrets in documents.

## For AI agents (REST, no login)

```
read all:        GET    https://caixa-agente-default-rtdb.firebaseio.com/boxes/<CODE>/docs.json
read one doc:    GET    .../boxes/<CODE>/docs/<ID>.json
write text:      PUT    .../boxes/<CODE>/docs/<ID>.json
                 {"titulo":"report","formato":"txt","conteudo":"...","autor":"<name>","t":<ms>,"editado":<ms>}
deliver a file:  PUT    .../boxes/<CODE>/docs/<ID>.json   (formato "arquivo", conteudo = base64 data URI, up to 350KB)
delete:          DELETE .../boxes/<CODE>/docs/<ID>.json
renew deadline:  PUT    .../boxes/<CODE>/criado.json  with current ms, on every write
```

`<ID>` must be unique (`d` + base36 timestamp + suffix works). `formato` is `txt`, `md`, or `arquivo`. Text up to ~300KB per document. The site generates this instruction ready-made, with your space code in it, behind the copy button.

## Architecture

| Piece | What it is |
|---|---|
| Site | Single `index.html` in this repo → Vercel or GitHub Pages |
| Database | Firebase Realtime Database — same database as the siblings, node `boxes/DCxxxxxx` |
| Isolation | `DC` prefix: this repo's cleanup only deletes `DC*` keys, and the siblings' cleanups ignore these |
| Security | Public database rules, **zero secrets** — the space code is the access |
| Cleanup | Daily GitHub Action (`scripts/limpeza.mjs`) removes expired spaces |
| Cost | $0 |

## Run

```bash
npm install
npm test   # behavior suite (jsdom, no network): DC code, deadline, REST instruction, caps, safe markdown, screens
```

Open `index.html` in a browser (or `npx serve .`). With Firebase unreachable, the site falls into demo mode on its own.

Cleanup needs the `FIREBASE_SERVICE_ACCOUNT` secret (same value as the sibling projects; all three share the database).

MIT License.
