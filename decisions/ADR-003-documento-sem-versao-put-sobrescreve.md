## ADR-003 — Documento sem histórico: PUT sobrescreve
- Context: versionamento exigiria lista de revisões, tela de diff e mais nós no
  banco — nenhum caso de uso da v1 pede isso (intent.md, fora de escopo).
- Decisão: um documento é um nó `docs/{id}`; salvar de novo troca `conteudo` e
  `editado`. O agente gera o `id` (timestamp base36 + sufixo) ao criar.
- Consequências: + REST continua sendo um PUT só, agente não precisa aprender
  protocolo novo; − escritas simultâneas no mesmo doc: a última vence.
- Decidido: 2026-10-16, [ASSUMPTION] do intake, aberto a veto do usuário.
