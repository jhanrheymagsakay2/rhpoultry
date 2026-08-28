import { getCategoryVisual, theme } from '../theme'

export default function CategoryChips({ categories, activeCategory, onSelect }) {
  const allChip = theme.allChip || { icon: '', label: 'All', image:'/images/app-bg.jpg'  }

  return (
    <div className="categories-scroll">
      <div
        className={`category-chip ${activeCategory === 'all' ? 'active' : ''} ${allChip.image ? 'has-image' : ''}`}
        style={allChip.image ? { backgroundImage: `url(${allChip.image})` } : undefined}
        onClick={() => onSelect('all')}
      >
        <span className="category-chip-label">
          {allChip.icon} {allChip.label || 'All'}
        </span>
      </div>
      {categories.map((cat) => {
        const visual = getCategoryVisual(cat)
        const isActive = activeCategory === cat

        return (
          <div
            key={cat}
            className={`category-chip ${isActive ? 'active' : ''} ${visual.image ? 'has-image' : ''}`}
            style={visual.image ? { backgroundImage: `url(${visual.image})` } : undefined}
            onClick={() => onSelect(cat)}
          >
            <span className="category-chip-label">
              {visual.icon} {cat}
            </span>
          </div>
        )
      })}
    </div>
  )
}