import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '../../test/renderApp.tsx'

test('shows a crystal with its sections and care info', async () => {
  renderApp('/crystal/malachite')
  expect(await screen.findByRole('heading', { level: 1, name: 'Malachite' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Metaphysical properties' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Healing properties' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Care' })).toBeInTheDocument()
  expect(screen.getByText('Not water safe')).toBeInTheDocument()
  expect(screen.getByRole('note')).toHaveTextContent(/toxic/i)
})

test('shows the photo credit with its license', async () => {
  renderApp('/crystal/amethyst')
  const credit = await screen.findByText(/photo:/i)
  expect(credit).toHaveTextContent(/CC|public domain/i)
})

test('unknown slug shows not found', async () => {
  renderApp('/crystal/nope')
  expect(await screen.findByText('Crystal not found')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /back to browse/i })).toBeInTheDocument()
})

test('tapping an intention searches Browse for it', async () => {
  renderApp('/crystal/black-tourmaline')
  await userEvent.click(await screen.findByRole('button', { name: 'protection' }))
  expect(screen.getByRole('searchbox', { name: 'Search crystals' })).toHaveValue('protection')
})

test('favoriting a crystal adds it to Favorites', async () => {
  renderApp('/crystal/amethyst')
  const button = await screen.findByRole('button', { name: /favorite/i })
  expect(button).toHaveAttribute('aria-pressed', 'false')
  await userEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'true')

  await userEvent.click(screen.getByRole('link', { name: 'Favorites' }))
  const list = await screen.findByRole('list', { name: 'Crystals' })
  expect(within(list).getByRole('link', { name: 'Amethyst' })).toBeInTheDocument()
})
