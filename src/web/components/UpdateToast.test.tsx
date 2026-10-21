import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UpdateToast } from './UpdateToast.tsx'

test('renders nothing when no update is waiting', () => {
  const { container } = render(<UpdateToast needRefresh={false} onReload={() => {}} onDismiss={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})

test('offers a reload and a dismiss when an update is waiting', async () => {
  const onReload = vi.fn()
  const onDismiss = vi.fn()
  render(<UpdateToast needRefresh onReload={onReload} onDismiss={onDismiss} />)
  await userEvent.click(screen.getByRole('button', { name: 'Updated — tap to reload' }))
  expect(onReload).toHaveBeenCalledOnce()
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
  expect(onDismiss).toHaveBeenCalledOnce()
})
