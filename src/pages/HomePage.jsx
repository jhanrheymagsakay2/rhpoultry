import { useMemo, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import ProductCard from '../components/ProductCard'

export default function HomePage({ products }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  )

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [products, activeCategory, search])

  return (
    <div className="page active">
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
