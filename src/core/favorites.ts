/** Platform-specific persistence for favorite crystal slugs. */
export interface FavoritesStore {
  load(): string[]
  save(slugs: string[]): void
}

export function createMemoryFavoritesStore(initial: string[] = []): FavoritesStore {
  let slugs = [...initial]
  return {
    load: () => [...slugs],
    save: (next) => {
      slugs = [...next]
    },
  }
}
