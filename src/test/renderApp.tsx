import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../web/App.tsx'
import { FavoritesProvider } from '../hooks/favorites.tsx'
import { BrowseStateProvider } from '../hooks/browseState.tsx'
import { createMemoryFavoritesStore } from '../core/favorites.ts'
import type { FavoritesStore } from '../core/favorites.ts'

/** Renders the full app at a route with in-memory favorites. */
export function renderApp(path = '/', store: FavoritesStore = createMemoryFavoritesStore()) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FavoritesProvider store={store}>
        <BrowseStateProvider>
          <AppRoutes />
        </BrowseStateProvider>
      </FavoritesProvider>
    </MemoryRouter>,
  )
}
