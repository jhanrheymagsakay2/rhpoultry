import CategoryIcon from './CategoryIcon'

const PRICE_ROWS = [
  { key: 'pricePerPiece', label: '📦 Per Piece:' },
  { key: 'pricePerBox', label: '📦 Per Box:' },
  { key: 'pricePerKilo', label: '⚖️ Per Kilo:' },
  { key: 'pricePerSack', label: '🛍️ Per Sack:' },
]

export default function ProductCard({ product, withActions, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-header">
        {product.image && (
          <img src={product.image} alt={product.name} className="product-photo" />
        )}
        <div className="product-header-text">
          <div className="product-name">{product.name}</div>
          <div className="product-category">
            <CategoryIcon category={product.category} size={14} /> {product.category || 'General'}
          </div>
        </div>
      </div>
      <div className="product-prices">
        {PRICE_ROWS.filter((row) => product[row.key] > 0).map((row) => (
          <div className="price-row" key={row.key}>
            <span>{row.label}</span>
            <span className="price-amount">₱{Number(product[row.key]).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {withActions && (
        <div className="action-buttons">
          <button className="btn-edit" onClick={() => onEdit(product)}>✏️ Edit</button>
          <button className="btn-delete" onClick={() => onDelete(product)}>🗑️ Delete</button>
        </div>
      )}
    </div>
  )
}
