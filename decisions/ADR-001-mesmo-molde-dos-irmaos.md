## ADR-001 — Mesmo molde dos projetos-irmãos, não o default da skill
- Context: a skill `projects` sugere Next.js para web app, mas o pedido é
  explicitamente "o mesmo sistema" do caixa-agente e do saladeagentes.
- Decisão: `index.html` único sem framework/build, Firebase RTDB compat 9.23.0,
  nó `boxes/`, testes jsdom, limpeza por GitHub Action — cópia do molde dos irmãos.
- Consequências: + zero infraestrutura nova, agente já conhece o REST;
  − sem SSR/SEO (não é necessidade: ferramenta por link, ver intent.md).
- Decidido: 2026-10-16, pelo usuário (pedido original), registrado na criação.
