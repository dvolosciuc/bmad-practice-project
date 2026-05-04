const https = require('https');

function fetch(hostname, path) {
  return new Promise((resolve) => {
    let d = '';
    const req = https.get({
      hostname, path,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
      timeout: 10000,
      rejectUnauthorized: false
    }, res => {
      res.on('data', c => { d += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: d, loc: res.headers.location }));
    });
    req.on('error', e => resolve({ err: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ err: 'timeout' }); });
  });
}

async function main() {
  // Try bing search
  const r = await fetch('www.bing.com', '/search?q=Moldova+taxa+drum+autoturisme+benzina+motorina+cm3+coeficient+reducere+lei&setlang=ro&mkt=ro-MD');
  console.log('Bing status:', r.status, 'len:', r.body.length);
  
  // Extract URLs from Bing results
  const urlRe = /href="(https?:\/\/[^"]+)"/g;
  let m;
  const urls = new Set();
  while ((m = urlRe.exec(r.body)) !== null) {
    const u = m[1];
    if (!u.includes('bing') && !u.includes('microsoft') && !u.includes('msn') &&
        (u.includes('drum') || u.includes('taxa') || u.includes('fiscal') || u.includes('contabil') || u.includes('sfs') || u.includes('fisc'))) {
      urls.add(u.split('&')[0]);
    }
  }
  console.log('Found URLs:');
  [...urls].slice(0, 15).forEach(u => console.log(' ', u));

  // Also look for cm3/coeficient snippets in the Bing HTML
  const text = r.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const keywords = ['cilindree', 'cm3', 'coeficient', 'benzin', 'motorin'];
  for (const kw of keywords) {
    const idx = text.toLowerCase().indexOf(kw);
    if (idx > -1) {
      console.log(`\nFound "${kw}" in Bing snippet:`);
      console.log(text.substring(Math.max(0, idx - 100), idx + 500));
    }
  }
}

main().catch(console.error);
