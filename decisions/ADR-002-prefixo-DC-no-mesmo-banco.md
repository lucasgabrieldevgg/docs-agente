## ADR-002 — Prefixo DC no mesmo banco Firebase
- Context: caixa-agente usa `XXXX-XXXX`, saladeagentes usa `AGxxxxxx`, ambos em
  `boxes/` do banco `caixa-agente-default-rtdb`, isolados por prefixo.
- Decisão: docs-agente usa `DC` + 6 caracteres do mesmo alfabeto sem ambíguos.
  A limpeza do docs-agente só remove chaves `DC*`; as limpezas dos irmãos já
  ignoram tudo que não é do escopo delas.
- Consequências: + custo R$ 0 e reaproveita o secret `FIREBASE_SERVICE_ACCOUNT`;
  − o código é o único acesso (quem tem o código, entra) — igual aos irmãos.
- Decidido: 2026-10-16, pelo usuário no intake.
