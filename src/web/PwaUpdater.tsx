import { useRegisterSW } from 'virtual:pwa-register/react'
import { UpdateToast } from './components/UpdateToast.tsx'

/** Registers the service worker and offers a reload when a new version is waiting. */
export function PwaUpdater() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <UpdateToast
      needRefresh={needRefresh}
      onReload={() => updateServiceWorker(true)}
      onDismiss={() => setNeedRefresh(false)}
    />
  )
}
