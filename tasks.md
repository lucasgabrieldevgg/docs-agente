# docs-agente — tarefas

- [x] F-001 esqueleto prova a si mesmo (critério: `npm test` roda e o `index.html` abre servido, sem build)
- [x] F-002 criar espaço gera código DC e instrução do agente (critério: instrução contém os endpoints REST do espaço)
- [x] F-003 agente escreve por REST, humano lê ao vivo (critério: doc criado via PUT aparece na lista sem recarregar)
- [x] F-004 humano também escreve (critério: novo doc no navegador salva, edita e baixa .txt/.md)
- [x] F-005 anexo até 350KB (critério: arquivo de 350KB passa, 351KB é recusado com aviso)
- [x] F-006 TTL 3/5/7 dias renovável (critério: escrita renova `criado`; limpeza só remove `DC*` vencido)
- [x] F-007 publicar no GitHub (criterio: repo criado, CI verde, site em docs-agente.vercel.app, secret da limpeza cadastrado e testado)

## Deferred
- Histórico de versões do documento (ADR-003) — dono: usuário, rever após v1 no ar.
- Exportar o espaço inteiro de uma vez — dono: usuário, rever após v1 no ar.
