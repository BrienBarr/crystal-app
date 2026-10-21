import { screen } from '@testing-library/react'
import crystals from '../../core/data/crystals.json'
import { renderApp } from '../../test/renderApp.tsx'

test('has the disclaimer, install steps, and an attribution per crystal', async () => {
  renderApp('/about')
  expect(screen.getByText(/not medical advice/i)).toBeInTheDocument()
  expect(screen.getAllByText(/Add to Home Screen/i).length).toBeGreaterThan(0)
  const attributions = await screen.findByRole('list', { name: 'Photo credits' })
  expect(attributions.querySelectorAll('li')).toHaveLength(crystals.length)
})
