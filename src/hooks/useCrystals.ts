import { useCallback, useEffect, useState } from 'react'
import { getAllCrystals, getCrystalBySlug } from '../core/repository.ts'
import type { Crystal } from '../core/types.ts'

interface AsyncState<T> {
  data: T
  loading: boolean
  error: Error | null
  retry(): void
}

function useAsync<T>(load: () => Promise<T>, initial: T, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    load()
      .then((value) => {
        if (!cancelled) setData(value)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { data, loading, error, retry }
}

export function useCrystals() {
  const { data, ...rest } = useAsync(getAllCrystals, [] as Crystal[], [])
  return { crystals: data, ...rest }
}

export function useCrystal(slug: string) {
  const { data, ...rest } = useAsync(
    () => getCrystalBySlug(slug),
    undefined as Crystal | undefined,
    [slug],
  )
  return { crystal: data, ...rest }
}
