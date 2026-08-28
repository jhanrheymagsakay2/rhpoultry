import { useMemo, useState } from 'react'
import CategoryIcon from '../components/CategoryIcon'
import ProductCard from '../components/ProductCard'

export default function ManagePage({ products, onEdit, onDelete }) {
  const [manageCategory, setManageCategory] = useState('all')

  const catCounts = useMemo(() => {
    const counts = {}
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [products])

  const allCats = useMemo(() => Object.keys(catCounts).sort(), [catCounts])

  const filtered = manageCategory === 'all' ? products : products.filter((p) => p.category === manageCategory)

  return (
    <div className="page active">
      <div className="manage-inner">
        <div className="manage-section-label">📊 By Category</div>
        <div className="category-summary-grid">
          <div
            className={`cat-summary-card ${manageCategory === 'all' ? 'active-filter' : ''}`}
            onClick={() => setManageCategory('all')}
          >
            <div className="cat-summary-icon">📦</div>
            <div>
              <div className="cat-summary-name">All</div>
              <div className="cat-summary-count">
                {products.length} item{products.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {allCats.map((cat) => (
            <div
              key={cat}
              className={`cat-summary-card ${manageCategory === cat ? 'active-filter' : ''}`}
              onClick={() => setManageCategory(cat)}
            >
              <div className="cat-summary-icon">
                <CategoryIcon category={cat} size={22} />
              </div>
              <div>
                <div className="cat-summary-name">{cat}</div>
                <div className="cat-summary-count">
                  {catCounts[cat]} item{catCounts[cat] !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="manage-filter-row">
          <div className="manage-filter-label">{manageCategory === 'all' ? 'All Products' : manageCategory}</div>
          {manageCategory !== 'all' && (
            <button className="manage-clear-btn" onClick={() => setManageCategory('all')}>
              ✕ Clear Filter
            </button>
          )}
        </div>

        <div className="product-list" style={{ padding: '0 0 20px' }}>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-text">Walang products pa</div>
              <div style={{ opacity: 0.7 }}>Click + button para mag-add</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <CategoryIcon category={manageCategory} size={48} />
              </div>
              <div className="empty-text">Walang products sa {manageCategory}</div>
            </div>
          ) : (
            filtered.map((p) => (
              <ProductCard key={p.id} product={p} withActions onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
