import { getCategoryVisual } from '../theme'

// Renders the category's custom image if theme.js has one set,
// otherwise falls back to the emoji icon. This is the only place
// that needs to know about that fallback logic.
export default function CategoryIcon({ category, size = 22 }) {
  const visual = getCategoryVisual(category)

  if (visual.image) {
    return (
      <img
        src={visual.image}
        alt={category}
        style={{ width: size, height: size, objectFit: 'cover', borderRadius: 6 }}
      />
    )
  }

  return <span style={{ fontSize: size }}>{visual.icon}</span>
}
