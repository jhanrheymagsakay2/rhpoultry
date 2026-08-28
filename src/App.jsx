import { useEffect, useState } from 'react'
import { applyTheme } from './theme'
import { useProducts } from './hooks/useProducts'

import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import LoadingOverlay from './components/LoadingOverlay'
import ProductModal from './components/ProductModal'
import PasswordPrompt from './components/PasswordPrompt'

import HomePage from './pages/HomePage'
import ManagePage from './pages/ManagePage'
import SettingsPage from './pages/SettingsPage'

// Password needed to Add a product or open the Manage tab.
const ADMIN_PASSWORD = 'user123@1'

export default function App() {
  const [page, setPage] = useState('home')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const [unlocked, setUnlocked] = useState(false)
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null) // 'add' | 'manage'

  const { products, syncStatus, addProduct, updateProduct, removeProduct } = useProducts()

  useEffect(() => {
    applyTheme()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  // Gate: called when tapping the + button or the Manage tab.
  const requireUnlock = (action) => {
    if (unlocked) {
      if (action === 'add') openAddModal()
      if (action === 'manage') setPage('manage')
      return
    }
    setPendingAction(action)
    setPasswordPromptOpen(true)
  }

  const handleFabClick = () => requireUnlock('add')

  const handleNavigate = (id) => {
    if (id === 'manage') {
      requireUnlock('manage')
    } else {
      setPage(id)
    }
  }

  const handlePasswordSubmit = (password) => {
    if (password !== ADMIN_PASSWORD) return false
    setUnlocked(true)
    setPasswordPromptOpen(false)
    if (pendingAction === 'add') openAddModal()
    if (pendingAction === 'manage') setPage('manage')
    setPendingAction(null)
    return true
  }

  const handleSaveProduct = async (formValues) => {
    setLoading(true)
    try {
      if (formValues.id) {
        await updateProduct(formValues)
        showToast('Product updated!', 'success')
      } else {
        const { id, ...rest } = formValues
        await addProduct(rest)
        showToast('Product added!', 'success')
      }
      setModalOpen(false)
    } catch {
      showToast('Error saving product!', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!confirm(`Delete "${product.name}"?`)) return
    setLoading(true)
    try {
      await removeProduct(product.id)
      showToast('Product deleted!', 'success')
    } catch {
      showToast('Error deleting product!', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header syncStatus={syncStatus} />

      {page === 'home' && <HomePage products={products} />}
      {page === 'manage' && (
        <ManagePage products={products} onEdit={openEditModal} onDelete={handleDeleteProduct} />
      )}
      {page === 'settings' && <SettingsPage syncStatus={syncStatus} />}

      <BottomNav activePage={page} onNavigate={handleNavigate} />

      <button className="fab" onClick={handleFabClick}>
        +
      </button>

      <ProductModal
        isOpen={modalOpen}
        editingProduct={editingProduct}
        products={products}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
      />

      <PasswordPrompt
        isOpen={passwordPromptOpen}
        onClose={() => {
          setPasswordPromptOpen(false)
          setPendingAction(null)
        }}
        onSubmit={handlePasswordSubmit}
      />

      <Toast toast={toast} />
      <LoadingOverlay show={loading} />
    </>
  )
}
