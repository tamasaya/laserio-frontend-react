import { create } from 'zustand'

export type ToastType = 'success' | 'error'

export type Toast = {
  id: number
  type: ToastType
  message: string
}

type ToastState = {
  toasts: Toast[]
  showToast: (type: ToastType, message: string) => void
  removeToast: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (type, message) => {
    const id = nextId++
    const toast: Toast = { id, type, message }
    set((state) => ({ toasts: [...state.toasts, toast] }))

    // Автоудаление через 4 секунды
    window.setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))


