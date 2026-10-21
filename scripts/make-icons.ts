// Renders the PWA / iOS icons from public/icon.svg.  Run: npm run icons
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const svg = readFileSync('public/icon.svg')
const BG = '#5a4229'

async function square(size: number, file: string) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(`public/icons/${file}`)
}

// Maskable icons need the artwork inside the central 80% safe zone.
async function maskable(size: number, file: string) {
  const inner = Math.round(size * 0.8)
  const art = await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toFile(`public/icons/${file}`)
}

await square(192, 'icon-192.png')
await square(512, 'icon-512.png')
await square(180, 'apple-touch-icon-180.png')
await maskable(512, 'maskable-512.png')
console.log('icons written to public/icons/')
