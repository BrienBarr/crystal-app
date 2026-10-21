import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.tsx'
import { renderApp } from '../test/renderApp.tsx'

test('the app opens on Browse', () => {
  render(<App />)
  expect(screen.getByRole('link', { name: 'Browse' })).toHaveAttribute('aria-current', 'page')
})

test('marks the active tab', () => {
  renderApp('/favorites')
  expect(screen.getByRole('link', { name: 'Favorites' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'Browse' })).not.toHaveAttribute('aria-current')
})

test('tab bar navigates to About', async () => {
  renderApp('/')
  await userEvent.click(screen.getByRole('link', { name: 'About' }))
  expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
})

test('unknown paths show a not-found page with a way back', () => {
  renderApp('/zzz')
  expect(screen.getByText(/not found/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /back to browse/i })).toHaveAttribute('href', '/')
})
