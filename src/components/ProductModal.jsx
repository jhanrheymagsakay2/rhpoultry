import { useEffect, useRef, useState } from 'react'
import { categoryNames } from '../theme'
import { fileToCompressedDataUrl } from '../utils/image'

const EMPTY_FORM = {
  name: '',
  category: 'Chicken',
  pricePerPiece: '',
  pricePerBox: '',
  pricePerKilo: '',
  pricePerSack: '',
  image: '',
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function ProductModal({ isOpen, editingProduct, products, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageError, setImageError] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Chicken',
        pricePerPiece: editingProduct.pricePerPiece || '',
        pricePerBox: editingProduct.pricePerBox || '',
        pricePerKilo: editingProduct.pricePerKilo || '',
        pricePerSack: editingProduct.pricePerSack || '',
        image: editingProduct.image || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setImageError('')
  }, [isOpen, editingProduct])

  if (!isOpen) return null

  const editingId = editingProduct?.id ?? null
  const trimmedName = form.name.trim().toLowerCase()
  const isDuplicate =
    trimmedName.length > 0 &&
    products.some((p) => p.name.toLowerCase() === trimmedName && p.id !== editingId)

  const handleNameChange = (e) => {
    setForm((f) => ({ ...f, name: toTitleCase(e.target.value) }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    setImageLoading(true)
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      setForm((f) => ({ ...f, image: dataUrl }))
    } catch (err) {
      setImageError('Could not use that image. Try a different photo.')
    } finally {
      setImageLoading(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    setForm((f) => ({ ...f, image: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate || !form.name.trim()) return

    onSave({
      id: editingId,
      name: form.name.trim(),
      category: form.category || 'General',
      pricePerPiece: parseFloat(form.pricePerPiece) || 0,
      pricePerBox: parseFloat(form.pricePerBox) || 0,
      pricePerKilo: parseFloat(form.pricePerKilo) || 0,
      pricePerSack: parseFloat(form.pricePerSack) || 0,
      image: form.image || '',
    })
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">{editingProduct ? 'Edit Product' : 'Add Product'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              required
              autoComplete="off"
              placeholder="e.g., Chicken Feed"
              value={form.name}
              onChange={handleNameChange}
            />
            <div className={`duplicate-warning ${isDuplicate ? 'show' : ''}`}>
              ⚠️ Product name already exists! Hindi pwede mag-add ng duplicate.
            </div>
          </div>

          <div className="form-group">
            <label>Product Photo</label>
            <div className="image-upload">
              {form.image ? (
                <div className="image-preview-wrap">
                  <img src={form.image} alt="" className="image-preview" />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={handleRemoveImage}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary image-pick-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                >
                  {imageLoading ? 'Processing…' : '📷 Add Photo'}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            {imageError && <div className="duplicate-warning show">{imageError}</div>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {categoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price Per Piece (₱)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.pricePerPiece}
              onChange={(e) => setForm((f) => ({ ...f, pricePerPiece: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Price Per Box (₱)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.pricePerBox}
              onChange={(e) => setForm((f) => ({ ...f, pricePerBox: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Price Per Kilo (₱)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.pricePerKilo}
              onChange={(e) => setForm((f) => ({ ...f, pricePerKilo: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Price Per Sack (₱)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.pricePerSack}
              onChange={(e) => setForm((f) => ({ ...f, pricePerSack: e.target.value }))}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isDuplicate}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
