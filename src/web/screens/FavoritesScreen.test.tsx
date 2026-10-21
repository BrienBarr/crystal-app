import { screen, within } from '@testing-library/react'
import { createMemoryFavoritesStore } from '../../core/favorites.ts'
import { renderApp } from '../../test/renderApp.tsx'

test('empty state explains how to add favorites', async () => {
  renderApp('/favorites')
  expect(await screen.findByText(/Tap ♥/)).toBeInTheDocument()
})

test('ignores favorites that no longer exist in the dataset', async () => {
  renderApp('/favorites', createMemoryFavoritesStore(['amethyst', 'deleted-stone']))
  const list = await screen.findByRole('list', { name: 'Crystals' })
  expect(within(list).getAllByRole('link').map((a) => a.textContent)).toEqual(['Amethyst'])
})
