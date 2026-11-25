// Takes the picker's real screenshots of each design from the built site (_site). Run after build.mjs:
//   node docs/gen/shots.mjs   (needs playwright; the images go to site/assets/designs/shots/)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
const { chromium } = createRequire(process.cwd() + '/')('playwright');
const dir = '_site', T = { '.html': 'text/html', '.css': 'text/css', '.jpg': 'image/jpeg' };
const srv = createServer((q, r) => { let f = join(dir, q.url.split('?')[0]); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html'); if (!existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[extname(f)] || 'x' }); r.end(readFileSync(f)); });
await new Promise((o) => srv.listen(0, o)); const base = `http://127.0.0.1:${srv.address().port}`;
mkdirSync('site/assets/designs/shots', { recursive: true });
const b = await chromium.launch();
for (const id of ['d1', 'd2', 'd3', 'd4', 'd5']) {
  const ph = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: 'light' })).newPage();
  await ph.goto(`${base}/design/${id}/`); await ph.addStyleTag({ content: '.design-bar{display:none!important}' }); await ph.screenshot({ path: `site/assets/designs/shots/${id}-phone.jpg`, type: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 390, height: 844 } });
  const dk = await (await b.newContext({ viewport: { width: 1100, height: 680 }, colorScheme: 'light' })).newPage();
  await dk.goto(`${base}/design/${id}/apple-intelligence/`); await dk.addStyleTag({ content: '.design-bar{display:none!important}' }); await dk.screenshot({ path: `site/assets/designs/shots/${id}-desktop.jpg`, type: 'jpeg', quality: 70 });
}
await b.close(); srv.close();
