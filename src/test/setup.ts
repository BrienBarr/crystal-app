import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement scrolling; record calls instead.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
beforeEach(() => {
  vi.mocked(window.scrollTo).mockClear()
})
