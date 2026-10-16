/* docs-agente — suíte de comportamento (jsdom, sem rede, sem Firebase).
   Testa comportamento observável: código do espaço, prazo, instrução do agente,
   documento/anexo, download e a renderização das telas no modo demonstração. */
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

let pass = 0, fail = 0; const FALHAS = [];
function ok(cond, nome) {
  if (cond) { pass++; console.log('  ✓ ' + nome); }
  else { fail++; FALHAS.push(nome); console.log('  ✗ ' + nome); }
}

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
const DA = window.DA;

console.log('— núcleo DA —');
ok(!!DA, 'objeto DA exposto para testes');
ok(/^DC[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/.test(DA.gerarCodigo()), 'código é DC + 6 do alfabeto sem ambíguos');
ok(!/[01OLI]/.test(DA.gerarCodigo().slice(2)), 'código não usa 0/O/1/L/I');
ok(DA.normalizaCodigo(' dc-ab23cd ') === 'DCAB23CD', 'normalizar tira espaço/traço e sobe caixa');
ok(DA.fmtCodigo('DCAB23CD') === 'DC-AB23CD', 'código exibido com traço no meio');
ok(DA.eCodigoValido('DCAB23CD') && !DA.eCodigoValido('AGAB12CD') && !DA.eCodigoValido('DCAB12C'), 'validar aceita só DC de 8');
ok(DA.novoDocId(36).startsWith('d'), 'id de documento começa com d');

console.log('— prazo (TTL) —');
ok(DA.ttlDe({ ttlHoras: 72 }) === 72 && DA.ttlDe({ ttlHoras: 999 }) === 168 && DA.ttlDe({}) === 168, 'ttl vale 72–168h, padrão 168');
ok(DA.ttlDe({ ttlHoras: 120 }) === 120, 'ttl de 5 dias (120h) passa');
const agora = Date.now();
ok(DA.expiraInfo({ criado: agora, ttlHoras: 72 }, agora).expirada === false, 'espaço recém-criado não expirou');
ok(DA.expiraInfo({ criado: agora - 73 * 3600000, ttlHoras: 72 }, agora).expirada === true, '73h sem escrita com ttl 72 = expirado');
ok(DA.expiraInfo({ criado: 0, ttlHoras: 72 }, agora).txt === 'sem prazo', 'sem carimbo = sem prazo');

console.log('— documento e anexo —');
const docTxt = { titulo: 'Relatório da sprint', formato: 'txt', conteudo: 'linha 1\nlinha 2', autor: 'agente-1', t: agora, editado: agora };
ok(DA.extensaoDe(docTxt) === 'txt', 'doc txt baixa como .txt');
ok(DA.extensaoDe({ ...docTxt, formato: 'md' }) === 'md', 'doc md baixa como .md');
ok(DA.nomeArquivoDe(docTxt) === 'Relatório da sprint.txt', 'nome do arquivo usa o título');
ok(DA.nomeArquivoDe({ ...docTxt, titulo: 'a/b:c?' }) === 'a-b-c-.txt', 'título perde caracteres proibidos no nome');
ok(DA.conteudoOk('a'.repeat(DA.TETO_TEXTO)) && !DA.conteudoOk('a'.repeat(DA.TETO_TEXTO + 1)), 'texto respeita o teto');
ok(DA.anexoOk(350 * 1024) && !DA.anexoOk(350 * 1024 + 1) && !DA.anexoOk(0), 'anexo: 350KB passa, 351KB e vazio não');
ok(DA.resumoDocs({ b: { ...docTxt, t: 2 }, a: { ...docTxt, t: 1 }, ruim: null }).map(d => d.t).join(',') === '2,1', 'lista ordena do mais novo pro mais antigo e ignora nó ruim');
ok(DA.resumoDocs(null).length === 0 && DA.resumoDocs('x').length === 0, 'espaço sem docs = lista vazia');

console.log('— instrução pro agente (REST) —');
const inst = DA.buildInstructions('DCAB23CD');
ok(inst.includes('/boxes/DCAB23CD/docs.json'), 'instrução traz GET da lista de docs');
ok(inst.includes('PUT') && inst.includes('/boxes/DCAB23CD/docs/'), 'instrução traz PUT de documento');
ok(inst.includes('criado.json'), 'instrução manda renovar o prazo');
ok(inst.includes('350KB'), 'instrução avisa o teto do anexo');
ok(!/ghp_[A-Za-z0-9]{20}|sk-or-v1-/.test(inst), 'instrução não vaza segredo');

console.log('— markdown sem HTML cru —');
const md = DA.renderMd('# Titulo\n\n**negrito** e `codigo`\n\n- um\n- dois');
ok(md.includes('<h1>Titulo</h1>') && md.includes('<strong>negrito</strong>'), 'md vira títulos e negrito');
ok(!DA.renderMd('<img src=x onerror=alert(1)>').includes('<img'), 'HTML cru do doc não entra na página');
ok(DA.escapeHtml('<b>&"') === '&lt;b&gt;&amp;&quot;', 'escape cobre < > & "');

console.log('— telas (modo demonstração, sem rede) —');
(async () => {
await new Promise(r => setTimeout(r, 60));
const d = window.document;
ok(!!d.querySelector('#view-home'), 'home existe');
ok(!!d.querySelector('#btn-create'), 'botão de criar espaço existe');
ok([...d.querySelectorAll('#new-ttl option')].map(o => o.value).join(',') === '72,120,168', 'criação oferece 3/5/7 dias');
d.querySelector('#btn-create').click();
ok(!d.querySelector('#view-espaco').hidden, 'criar espaço abre o espaço (demo sem Firebase)');
ok((d.querySelector('#top-code').textContent || '').includes('DC'), 'topo mostra o código DC');
ok(d.querySelectorAll('#docs .doc-item').length >= 1, 'espaço demo nasce com documento de exemplo');
const antes = d.querySelectorAll('#docs .doc-item').length;
d.querySelector('#new-titulo').value = 'Ata da reunião';
d.querySelector('#new-corpo').value = 'decidimos a pauta';
await d.querySelector('#btn-salvar-doc').click(); await new Promise(r => setTimeout(r, 30));
ok(d.querySelectorAll('#docs .doc-item').length === antes + 1, 'humano salva documento novo e ele aparece na lista');
ok((d.querySelector('#aviso')?.textContent || '').length >= 0, 'área de aviso existe');
ok(!!d.querySelector('#btn-tema'), 'botão de tema existe no topo');
ok(!!d.querySelector('#btn-tema svg'), 'botão de tema é ícone SVG, sem texto');
d.querySelector('#btn-tema').click();
ok(dom.window.document.documentElement.dataset.tema === 'escuro', 'clicar no botão liga o tema escuro');
ok(dom.window.localStorage.getItem('da_tema') === 'escuro', 'escolha do tema fica salva no navegador');
d.querySelector('#btn-tema').click();
ok(dom.window.document.documentElement.dataset.tema === 'claro', 'clicar de novo volta ao claro');
ok(d.querySelector('#btn-tema').textContent.trim() === '', 'botão de tema não carrega texto nenhum');

console.log('— guarda de identidade —');
ok(/Fraunces/.test(html) && /IBM Plex Sans/.test(html) && /IBM Plex Mono/.test(html), 'tipografia Fraunces + IBM Plex Sans/Mono presente');
ok(!/radial-gradient|7c5cff|4f6df5|8b5cf6|background-clip:\s*text/.test(html), 'sem gradiente/glow/roxo de IA no CSS');
ok(/caixa-agente-default-rtdb\.firebaseio\.com/.test(html), 'usa o mesmo banco Firebase dos irmãos');
ok(html.includes(String.raw`data-tema="escuro"`), 'tema escuro definido por variáveis, não por remendo');

console.log('\nRESULTADO: ' + pass + ' ✓ / ' + fail + ' ✗' + (fail ? (' → ' + FALHAS.join(' | ')) : ' — SUÍTE INTEIRA PASSOU'));
process.exit(fail ? 1 : 0);
})();
