const SYNC_LABEL = {
  synced: { text: 'Connected to cloud', icon: '✅' },
  syncing: { text: 'Updating data...', icon: '🔄' },
  offline: { text: 'No internet connection', icon: '❌' },
}

export default function SettingsPage({ syncStatus }) {
  const status = SYNC_LABEL[syncStatus] || SYNC_LABEL.offline

  return (
    <div className="page active">
      <div className="settings-section">
        <div className="settings-card">
          <div className="settings-title">☁️ Cloud Sync</div>
          <div className="settings-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Sync Status</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  {status.text}
                </div>
              </div>
              <div style={{ fontSize: 24 }}>{status.icon}</div>
            </div>
          </div>
          <div className="settings-item">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>How Cloud Sync Works:</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              • All devices share the same data automatically
              <br />
              • Add/Edit/Delete on one device = updates everywhere
              <br />
              • Works online and offline
              <br />• Data syncs when internet is available
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-title">ℹ️ About</div>
          <div className="settings-item">
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              RH Poultry Store v2.0 (Cloud Sync)
              <br />
              Powered by Firebase Firestore
              <br />
              Real-time inventory management
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
