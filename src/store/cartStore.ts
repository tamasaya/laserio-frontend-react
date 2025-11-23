import { create } from 'zustand'

export type CartProduct = {
  id: number
  name: string
  slug: string
  price: number
  primary_image_url?: string | null
}

export type CartItem = {
  product: CartProduct
  qty: number
}

type CartState = {
  items: CartItem[]
  add: (product: CartProduct) => void
  remove: (productId: number) => void
  setQty: (productId: number, qty: number) => void
  clear: () => void
}

const STORAGE_KEY = 'laserio_cart_v1'

function loadInitial(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as CartItem[]
  } catch {
    return []
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitial(),
  add: (product) => {
    const current = get().items
    const existing = current.find((i) => i.product.id === product.id)
    const next = existing
      ? current.map((i) =>
          i.product.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i,
        )
      : [...current, { product, qty: 1 }]
    set({ items: next })
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  },
  remove: (productId) => {
    const next = get().items.filter((i) => i.product.id !== productId)
    set({ items: next })
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  },
  setQty: (productId, qty) => {
    const sanitized = qty < 1 ? 1 : qty
    const next = get().items.map((i) =>
      i.product.id === productId ? { ...i, qty: sanitized } : i,
    )
    set({ items: next })
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  },
  clear: () => {
    set({ items: [] })
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  },
}))


