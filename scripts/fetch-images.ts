// Downloads one Wikimedia Commons photo per crystal, resizes it to WebP, and
// writes the attribution back into crystals.json.
//
//   npm run images                 fetch any missing images
//   npm run images -- --force      re-fetch everything
//   npm run images -- --only amethyst
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import type { Crystal } from '../src/core/types.ts'

const DATA_PATH = 'src/core/data/crystals.json'
const SOURCES_PATH = 'scripts/image-sources.json'
const OUT_DIR = 'public/crystals'
const API = 'https://commons.wikimedia.org/w/api.php'
const HEADERS = { 'User-Agent': 'CrystalApp/0.1 (personal project)' }
const WIDTH = 800

interface ImageInfo {
  thumburl: string
  descriptionurl: string
  extmetadata?: Record<string, { value: string } | undefined>
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const onlyIndex = args.indexOf('--only')
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : undefined

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

async function fetchWithRetry(url: string): Promise<Response> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: HEADERS })
    if (res.ok) return res
    if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status} for ${url}`)
    await sleep(5000 * (attempt + 1))
  }
  throw new Error(`gave up on ${url}`)
}

async function imageInfo(title: string): Promise<ImageInfo> {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: String(WIDTH),
    format: 'json',
  })
  const res = await fetchWithRetry(`${API}?${params}`)
  const json = (await res.json()) as { query?: { pages?: Record<string, { imageinfo?: ImageInfo[] }> } }
  const page = Object.values(json.query?.pages ?? {})[0]
  const info = page?.imageinfo?.[0]
  if (!info) throw new Error(`no imageinfo for ${title}`)
  return info
}

async function main() {
  const crystals = JSON.parse(readFileSync(DATA_PATH, 'utf8')) as Crystal[]
  const sources = JSON.parse(readFileSync(SOURCES_PATH, 'utf8')) as Record<string, string>
  const failures: string[] = []

  for (const crystal of crystals) {
    if (only && crystal.slug !== only) continue
    const outFile = path.join(OUT_DIR, crystal.image.file)
    if (existsSync(outFile) && crystal.image.sourceUrl && !force && !only) continue

    const title = sources[crystal.slug]
    if (!title) {
      failures.push(`${crystal.slug}: no entry in ${SOURCES_PATH}`)
      continue
    }

    try {
      const info = await imageInfo(title)
      const res = await fetchWithRetry(info.thumburl)
      const buffer = Buffer.from(await res.arrayBuffer())
      await sharp(buffer)
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(outFile)

      const meta = info.extmetadata ?? {}
      crystal.image.credit = stripHtml(meta.Artist?.value ?? 'Unknown') || 'Unknown'
      crystal.image.license = stripHtml(meta.LicenseShortName?.value ?? '')
      crystal.image.sourceUrl = info.descriptionurl
      writeFileSync(DATA_PATH, JSON.stringify(crystals, null, 2) + '\n')
      console.log(`ok   ${crystal.slug}`)
    } catch (error) {
      failures.push(`${crystal.slug}: ${(error as Error).message}`)
    }
    await sleep(1000)
  }

  if (failures.length) {
    console.error(`\n${failures.length} failed:\n${failures.join('\n')}`)
    process.exit(1)
  }
}

main()
