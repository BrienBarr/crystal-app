import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import crystals from '../../core/data/crystals.json'
import { searchCrystals } from '../../core/search.ts'
import type { Crystal } from '../../core/types.ts'
import { renderApp } from '../../test/renderApp.tsx'

const data = crystals as Crystal[]

async function cardNames() {
  const list = await screen.findByRole('list', { name: 'Crystals' })
  return within(list)
    .getAllByRole('link')
    .map((a) => a.textContent)
}

test('shows every crystal initially', async () => {
  renderApp('/')
  expect(await cardNames()).toHaveLength(data.length)
})

test('typing a name puts that crystal first', async () => {
  renderApp('/')
  await userEvent.type(screen.getByRole('searchbox', { name: 'Search crystals' }), 'rose quartz')
  expect((await cardNames())[0]).toBe('Rose Quartz')
})

test('typing an intention shows the matching crystals', async () => {
  renderApp('/')
  await userEvent.type(screen.getByRole('searchbox', { name: 'Search crystals' }), 'anxiety')
  expect(await cardNames()).toEqual(searchCrystals(data, 'anxiety').map((c) => c.name))
})

test('chakra filter narrows results and can be cleared', async () => {
  renderApp('/')
  await userEvent.click(await screen.findByRole('button', { name: /^Chakra/ }))
  const sheet = screen.getByRole('dialog', { name: 'Chakra' })
  await userEvent.click(within(sheet).getByRole('checkbox', { name: 'Heart' }))
  await userEvent.click(within(sheet).getByRole('button', { name: 'Done' }))

  const heart = data.filter((c) => c.chakras.includes('heart')).map((c) => c.name)
  const shown = await cardNames()
  expect(shown.length).toBe(heart.length)
  expect(shown.every((n) => heart.includes(n!))).toBe(true)
  expect(screen.getByRole('button', { name: /^Chakra/ })).toHaveTextContent('1')

  await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
  expect(await cardNames()).toHaveLength(data.length)
})

test('color options are the distinct colors in the dataset', async () => {
  renderApp('/')
  await userEvent.click(await screen.findByRole('button', { name: /^Color/ }))
  const sheet = screen.getByRole('dialog', { name: 'Color' })
  const options = within(sheet)
    .getAllByRole('checkbox')
    .map((c) => (c as HTMLInputElement).value)
  expect(options).toEqual([...new Set(data.flatMap((c) => c.colors))].sort())
})

test('no matches shows an empty state that clears everything', async () => {
  renderApp('/')
  const search = screen.getByRole('searchbox', { name: 'Search crystals' })
  await userEvent.type(search, 'zzzz')
  expect(await screen.findByText('No crystals match')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
  expect(search).toHaveValue('')
  expect(await cardNames()).toHaveLength(data.length)
})

test('search and filters persist after opening a crystal and coming back', async () => {
  renderApp('/')
  await userEvent.type(screen.getByRole('searchbox', { name: 'Search crystals' }), 'quartz')
  const [first] = within(await screen.findByRole('list', { name: 'Crystals' })).getAllByRole('link')
  await userEvent.click(first)
  await userEvent.click(screen.getByRole('link', { name: 'Browse' }))
  expect(screen.getByRole('searchbox', { name: 'Search crystals' })).toHaveValue('quartz')
})

test('restores the grid scroll position after returning from a crystal', async () => {
  renderApp('/')
  const [card] = within(await screen.findByRole('list', { name: 'Crystals' })).getAllByRole('link')
  Object.defineProperty(window, 'scrollY', { value: 1200, configurable: true })
  await userEvent.click(card)
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  await userEvent.click(screen.getByRole('link', { name: 'Browse' }))
  await screen.findByRole('list', { name: 'Crystals' })
  await waitFor(() => expect(window.scrollTo).toHaveBeenLastCalledWith(0, 1200))
})
