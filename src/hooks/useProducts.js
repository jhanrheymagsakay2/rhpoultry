import { useCallback, useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'

const productsRef = collection(db, 'products')

export function useProducts() {
  const [products, setProducts] = useState([])
  const [syncStatus, setSyncStatus] = useState('syncing') // 'synced' | 'syncing' | 'offline'
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const q = query(productsRef, orderBy('name'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setSyncStatus('synced')
        setLoaded(true)
      },
      (error) => {
        console.error('Snapshot error:', error)
        setSyncStatus('offline')
        setLoaded(true)
      }
    )
    return unsubscribe
  }, [])

  const addProduct = useCallback(async (product) => {
    setSyncStatus('syncing')
    try {
      await addDoc(productsRef, product)
      setSyncStatus('synced')
    } catch (error) {
      console.error('Error adding product:', error)
      setSyncStatus('offline')
      throw error
    }
  }, [])

  const updateProduct = useCallback(async ({ id, ...data }) => {
    setSyncStatus('syncing')
    try {
      await updateDoc(doc(db, 'products', id), data)
      setSyncStatus('synced')
    } catch (error) {
      console.error('Error updating product:', error)
      setSyncStatus('offline')
      throw error
    }
  }, [])

  const removeProduct = useCallback(async (id) => {
    setSyncStatus('syncing')
    try {
      await deleteDoc(doc(db, 'products', id))
      setSyncStatus('synced')
    } catch (error) {
      console.error('Error deleting product:', error)
      setSyncStatus('offline')
      throw error
    }
  }, [])

  const clearAllProducts = useCallback(async () => {
    setSyncStatus('syncing')
    try {
      const snapshot = await getDocs(productsRef)
      const batch = writeBatch(db)
      snapshot.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
      setSyncStatus('synced')
    } catch (error) {
      console.error('Error clearing products:', error)
      setSyncStatus('offline')
      throw error
    }
  }, [])

  return { products, syncStatus, loaded, addProduct, updateProduct, removeProduct, clearAllProducts }
}
