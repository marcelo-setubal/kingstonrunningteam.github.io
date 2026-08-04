/* Service worker dos apps (Notas.Voz e Despesas)
   Objetivo: as páginas abrirem e funcionarem sem internet (avião, roaming cortado, sinal ruim).
   Só toma conta dos arquivos dos apps e das fontes — qualquer outra página do site
   (inclusive a home do Kingston Running Team) passa direto, sem cache. */

const CACHE = 'apps-v3';

const ARQUIVOS = [
  './notas.html',
  './manifest.webmanifest',
  './despesas.html',
  './despesas.webmanifest',
  './icone-192.png',
  './icone-512.png'
];

// Caminhos absolutos dos arquivos do app, para comparar com as requisições.
const CAMINHOS_APP = new Set(ARQUIVOS.map(a => new URL(a, self.location).pathname));

const ehFonte = url =>
  url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';

self.addEventListener('install', evento => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Um arquivo ausente não pode derrubar a instalação inteira.
    await Promise.allSettled(ARQUIVOS.map(a => cache.add(new Request(a, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', evento => {
  evento.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  const doApp = url.origin === self.location.origin && CAMINHOS_APP.has(url.pathname);
  if (!doApp && !ehFonte(url)) return; // não é nosso: deixa o navegador cuidar

  // Entrega o que está em cache na hora e atualiza por baixo quando houver rede.
  evento.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const guardado = await cache.match(req, { ignoreSearch: true });

    const daRede = fetch(req)
      .then(resposta => {
        if (resposta && (resposta.ok || resposta.type === 'opaque')) {
          cache.put(req, resposta.clone()).catch(() => {});
        }
        return resposta;
      })
      .catch(() => null);

    if (guardado) return guardado;

    const resposta = await daRede;
    if (resposta) return resposta;

    // Offline e sem cópia guardada: cai para a página do app que estava sendo aberta.
    if (req.mode === 'navigate') {
      const pagina = url.pathname.includes('despesas') ? './despesas.html' : './notas.html';
      const reserva = await cache.match(new URL(pagina, self.location).pathname);
      if (reserva) return reserva;
    }
    // Fonte indisponível não é problema: o app cai para a fonte do sistema.
    if (ehFonte(url)) return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });

    return new Response('Offline e sem cópia guardada deste arquivo.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  })());
});
