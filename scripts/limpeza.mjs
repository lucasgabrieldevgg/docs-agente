#!/usr/bin/env node
/* Limpeza de espacos expirados do Docs do Agente (Firebase RTDB).
 * Roda via GitHub Action (cron diario). Precisa do secret FIREBASE_SERVICE_ACCOUNT.
 * Regra: apaga boxes/DCxxxxxx cuja ultima escrita (`criado`, renovada a cada
 * documento salvo) seja mais antiga que o prazo do espaco (`ttlHoras`, 72-168h).
 * So mexe em espacos do docs-agente (chave comeca com "DC") — caixas e salas intactas.
 */
let raw = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
if (!raw) {
  console.log('Secret FIREBASE_SERVICE_ACCOUNT ausente — limpeza pulada.');
  console.log('   Configure em: repo → Settings → Secrets and variables → Actions.');
  process.exit(0);
}
if (!raw.startsWith('{')) {
  try { raw = Buffer.from(raw, 'base64').toString('utf8'); } catch {}
}
let sa;
try { sa = JSON.parse(raw); }
catch (e) { console.error('Secret nao e um JSON valido de service account:', e.message); process.exit(1); }

const { initializeApp, cert } = await import('firebase-admin/app');
const { getDatabase } = await import('firebase-admin/database');

const DB_URL = sa.databaseURL || 'https://caixa-agente-default-rtdb.firebaseio.com';
initializeApp({ credential: cert(sa), databaseURL: DB_URL });

const snap = await getDatabase().ref('boxes').once('value');
const total = snap.numChildren();
const vencidos = [];
snap.forEach(ch => {
  const code = ch.key;
  if (!code || !code.startsWith('DC')) return;   /* só espaços DC; caixa e sala não */
  const v = ch.val() || {};
  const t = typeof v.criado === 'number' ? v.criado : 0;
  const ttlH = (typeof v.ttlHoras === 'number' && v.ttlHoras >= 72 && v.ttlHoras <= 168)
    ? Math.round(v.ttlHoras) : 168;
  if (t && t < Date.now() - ttlH * 3600000) vencidos.push(code);
});

console.log(`Varredura: ${total} nó(s) em boxes · ${vencidos.length} espaco(s) DC vencido(s)`);
let removidos = 0;
for (const code of vencidos) {
  try {
    await getDatabase().ref('boxes/' + code).remove();
    removidos++;
    console.log('  removido:', code);
  } catch (e) {
    console.error('  falha ao remover', code, e.message);
  }
}
console.log(`Fim: ${removidos} espaco(s) removido(s).`);
process.exit(0);  /* o client do RTDB segura sockets abertos - sem isso o runner fica pendurado */
