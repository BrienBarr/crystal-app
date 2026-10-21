import { useMemo } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { FavoritesProvider } from '../hooks/favorites.tsx'
import { BrowseStateProvider } from '../hooks/browseState.tsx'
import { createLocalStorageFavoritesStore } from './localStorageFavorites.ts'
import { TabBar } from './components/TabBar.tsx'
import { NotFound } from './components/NotFound.tsx'
import { BrowseScreen } from './screens/BrowseScreen.tsx'
import { CrystalScreen } from './screens/CrystalScreen.tsx'
import { FavoritesScreen } from './screens/FavoritesScreen.tsx'
import { AboutScreen } from './screens/AboutScreen.tsx'
import './styles/global.css'

export function AppRoutes() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<BrowseScreen />} />
        <Route path="/crystal/:slug" element={<CrystalScreen />} />
        <Route path="/favorites" element={<FavoritesScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <TabBar />
    </div>
  )
}

export default function App() {
  const store = useMemo(() => createLocalStorageFavoritesStore(), [])
  return (
    <HashRouter>
      <FavoritesProvider store={store}>
        <BrowseStateProvider>
          <AppRoutes />
        </BrowseStateProvider>
      </FavoritesProvider>
    </HashRouter>
  )
}
