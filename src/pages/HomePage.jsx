import { useCallback, useMemo, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import ProductCard from '../components/ProductCard'
import { useContinuousVoiceSearch } from '../hooks/useContinuousVoiceSearch'
import { fuzzyMatch } from '../utils/fuzzyMatch'

export default function HomePage({ products }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const handleVoiceResult = useCallback((text) => setSearch(text), [])

  const { listening, supported, needsPermissionTap, requestPermission } = useContinuousVoiceSearch({
    onResult: handleVoiceResult,
    enabled: voiceEnabled,
  })

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  )

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (search) list = list.filter((p) => fuzzyMatch(p.name, search))
    return list
  }, [products, activeCategory, search])

  return (
    <div className="page active">
      <div className="search-container">
        <div className="search-box-wrap">
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {supported && (
            <button
              type="button"
              className={`mic-btn ${listening ? 'mic-listening' : ''}`}
              title={voiceEnabled ? 'Voice search on — tap to mute' : 'Tap to enable voice search'}
              onClick={() => setVoiceEnabled((v) => !v)}
            >
              {voiceEnabled ? '🎤' : '🔇'}
            </button>
          )}
        </div>
        {needsPermissionTap && (
          <button type="button" className="mic-permission-hint" onClick={requestPermission}>
            🎤 Tap once to enable voice search (only needed the first time)
          </button>
        )}
      </div>

      <div className="categories-container">
        <CategoryChips categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="product-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">Walang nakita</div>
            <div style={{ opacity: 0.7 }}>Try different search or category</div>
          </div>
        ) : (
          filtered.map((p) => <ProductCard key={p.id} product={p} withActions={false} />)
        )}
      </div>
    </div>
  )
}
