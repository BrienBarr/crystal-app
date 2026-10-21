import { NavLink } from 'react-router-dom'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/', label: 'Browse', icon: '◇' },
  { to: '/favorites', label: 'Favorites', icon: '♥' },
  { to: '/about', label: 'About', icon: 'ⓘ' },
]

export function TabBar() {
  return (
    <nav className={styles.bar} aria-label="Main">
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end className={styles.tab}>
          <span className={styles.icon} aria-hidden="true">
            {tab.icon}
          </span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
