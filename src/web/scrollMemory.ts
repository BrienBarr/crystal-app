// Remembers where the Browse grid was scrolled so returning from a crystal
// lands in the same place. Only restored when the search hasn't changed.
let saved: { y: number; key: string } | null = null

export function saveBrowseScroll(key: string, y: number) {
  saved = { y, key }
}

export function takeBrowseScroll(key: string): number | null {
  const y = saved && saved.key === key ? saved.y : null
  saved = null
  return y
}
