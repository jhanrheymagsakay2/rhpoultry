import { theme } from '../theme'

const STATUS_TEXT = {
  synced: '✅ Synced',
  syncing: '🔄 Syncing...',
  offline: '❌ Offline',
}

export default function Header({ syncStatus }) {
  return (
    <div className="header">
      <h1>
        {theme.logo ? (
          <img src={theme.logo} alt={theme.appName} className="header-logo" />
        ) : (
          ' '
        )}
        {theme.appName}
      </h1>
      <div className="header-subtitle">{theme.appSubtitle}</div>
      <div className={`sync-status ${syncStatus}`}>{STATUS_TEXT[syncStatus]}</div>
    </div>
  )
}
