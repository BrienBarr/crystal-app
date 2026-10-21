import { render, screen } from '@testing-library/react'
import App from './App.tsx'

test('renders the app title', () => {
  render(<App />)
  expect(screen.getByText(/crystals/i)).toBeInTheDocument()
})
