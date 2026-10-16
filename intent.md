# docs-agente — intenção

**Tipo de produto:** web app (uma página, sem servidor próprio).
Verificações puladas de propósito: SEO (ferramenta de uso por link, não conteúdo
público), login/contas (o código do espaço é o acesso, como nos projetos-irmãos),
sincronização offline (o Firebase já é a fonte; sem rede, modo demonstração).

## Pronto quando (done-when)
1. A pessoa cria um espaço em 1 clique e recebe um código `DCxxxxxx` e a instrução
   pronta para colar no agente dela.
2. O agente, sem navegador e sem login, cria e atualiza documentos por REST
   (`GET`/`PUT` em `.../boxes/DCxxxxxx/docs.json`) e renova o prazo do espaço.
3. A pessoa abre o espaço e vê os documentos ao vivo, lê, edita, baixa `.txt`/`.md`
   e anexos, e também escreve documentos novos — agente e humano no mesmo espaço.
4. O espaço apaga sozinho após 3, 5 ou 7 dias sem escrita (escolhido na criação);
   cada escrita renova o prazo.
5. O espaço do docs-agente nunca mistura com caixa-agente e saladeagentes:
   mesmo banco Firebase, prefixo `DC` separa tudo — inclusive nas limpezas.

## Não pode mudar (must-not-change)
- Mesmo banco dos projetos-irmãos: `caixa-agente-default-rtdb`, nó `boxes/`.
- Molde de repositório: `index.html` único, sem framework, sem build.
- Nada de segredo no site; a apiKey web do Firebase é pública por desenho.
- UI em pt-BR; código e comentários em inglês onde o molde dos irmãos pede.

## Fora da v1 (out of scope)
- Versões/histórico de documento (PUT sobrescreve; registrado em ADR-003).
- Exportar o espaço inteiro de uma vez (baixar é por documento).
- Pastas, comentários no documento, edição simultânea com cursor compartilhado.
- Login, permissões por pessoa, documento público por link separado.

## Decisões do intake (usuário, 2026-10-16)
- Nome: **docs-agente**, prefixo `DC`.
- Quem escreve: agente E humano editam.
- Formatos: TXT/MD editáveis + anexos de qualquer tipo até 350KB.
- TTL: 3/5/7 dias de inatividade, renovável — igual aos outros dois.

## Suposições (assumptions ledger)
- [ASSUMPTION] Documento de texto tem teto prático de ~300KB de conteúdo
  (limite do nó no RTDB); anexo segue o teto de 350KB da Sala de Agentes.
- [ASSUMPTION] Sem versionamento na v1: quem dá PUT por último vence.
- Nenhuma pergunta aberta pendente: zero dangling.
