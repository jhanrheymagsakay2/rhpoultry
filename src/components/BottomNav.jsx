const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'manage', icon: '📝', label: 'Manage' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  )
}
