/**
 * Fetches the latest ANRE fuel reference prices from anre.md and updates
 * src/data/anre.json.  Run by the GitHub Actions "Update ANRE Prices" workflow.
 *
 * Usage: node scripts/fetch-anre-prices.mjs
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const JSON_PATH = path.join(__dirname, '../src/data/anre.json')

/** Simple HTTPS GET with redirect following. */
function get(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    let data = ''
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Moldova-EV-PriceFetcher/2.0)',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'ro-MD,ro;q=0.9',
        },
        timeout: 20_000,
      },
      res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirectsLeft === 0) return reject(new Error('Too many redirects'))
          return get(res.headers.location, redirectsLeft - 1).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
        res.setEncoding('utf8')
        res.on('data', chunk => (data += chunk))
        res.on('end', () => resolve(data))
      },
    )
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timed out'))
    })
  })
}

/** Convert Romanian number string ("30,18") to float (30.18). */
function parseRo(s) {
  return parseFloat(s.replace(',', '.'))
}

async function main() {
  console.log('Fetching ANRE homepage…')
  const html = await get('https://anre.md')

  // Strip HTML tags and decode common entities for plain-text regex matching.
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')

  // ── Reference price block ─────────────────────────────────────────────────
  // Heading example: "Prețul maxim de referință, stabilit la data de 04.05.2026"
  // The table that follows contains Benzin 95 and Motorin rows with comma-
  // separated decimals, e.g. "30,18".
  // Capture a wide window so both the Benzin and Motorin rows are included even
  // when an inline chart script sits between the heading and the table rows.
  const refBlock =
    text.match(/Pre[tț]ul\s+maxim\s+de\s+referin[tț][ăa](.{0,8000})/i)?.[1] ?? ''

  const benzMatch = refBlock.match(/Benzin[ăa]\s*95.{0,80}?(\d{2}[,]\d{1,2})/)
  const motorMatch = refBlock.match(/Motorin[ăa].{0,200}?(\d{2}[,]\d{1,2})/)

  if (!benzMatch || !motorMatch) {
    throw new Error(
      'Could not parse reference prices from ANRE. ' +
        `benzMatch=${JSON.stringify(benzMatch)}, motorMatch=${JSON.stringify(motorMatch)}\n` +
        `refBlock preview: "${refBlock.slice(0, 300)}"`,
    )
  }

  const benzina95 = parseRo(benzMatch[1])
  const motorina = parseRo(motorMatch[1])

  // ── GPL: from the station prices widget (dot-decimal, e.g. "15.50 MDL") ──
  // ANRE doesn't publish a regulated maximum for GPL, so we use the lowest
  // displayed station price as a representative value.
  const gplBlock = text.match(/[Gg]az\s+[Ll]ichefiat(.{0,400})/)?.[1] ?? ''
  const gplPrices = [...gplBlock.matchAll(/(\d{2}\.\d{2})\s*MDL/g)].map(m =>
    parseFloat(m[1]),
  )
  const gpl = gplPrices.length ? Math.min(...gplPrices) : null

  // ── Date from the "stabilit la data de DD.MM.YYYY" heading ───────────────
  const dateMatch = text.match(/stabilit\s+la\s+data\s+de\s+(\d{2})\.(\d{2})\.(\d{4})/)
  const lastVerified = dateMatch
    ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`
    : new Date().toISOString().split('T')[0]

  // ── Load existing prices ──────────────────────────────────────────────────
  const existing = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))

  const updated = {
    benzina95,
    motorina,
    gpl: gpl ?? existing.gpl,
    lastVerified,
  }

  const unchanged =
    updated.benzina95 === existing.benzina95 &&
    updated.motorina === existing.motorina &&
    updated.gpl === existing.gpl &&
    updated.lastVerified === existing.lastVerified

  if (unchanged) {
    console.log('Prices unchanged:', existing)
    return
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2) + '\n')
  console.log('Updated anre.json:')
  console.log(JSON.stringify(updated, null, 2))
}

main().catch(err => {
  console.error('fetch-anre-prices failed:', err.message)
  process.exit(1)
})
