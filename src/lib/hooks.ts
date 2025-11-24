import { useEffect, useState } from 'react'
import {
  fetchCategoryDetail,
  fetchCategoryTree,
  fetchProduct,
  fetchProductsList,
  type CategoryDetailNonLeaf,
  type CategoryTreeResponse,
  type PaginatedProductsResponse,
  type ProductDetail,
  type ProductsListResponse,
} from './api'

export type LoadState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export function useCategoryTree() {
  const [state, setState] = useState<LoadState<CategoryTreeResponse>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchCategoryTree()
      .then((data) => {
        if (cancelled) return
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Ошибка загрузки',
        })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function useCategoryDetail(slug: string, page?: number) {
  const [state, setState] = useState<
    LoadState<CategoryDetailNonLeaf | PaginatedProductsResponse>
  >({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchCategoryDetail(slug, page)
      .then((data) => {
        if (cancelled) return
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Ошибка загрузки',
        })
      })
    return () => {
      cancelled = true
    }
  }, [slug, page])

  return state
}

export function useProduct(slug: string) {
  const [state, setState] = useState<LoadState<ProductDetail>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchProduct(slug)
      .then((data) => {
        if (cancelled) return
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Ошибка загрузки',
        })
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}

export function useProductsList(options: {
  q?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
  enabled?: boolean
}) {
  const [state, setState] = useState<LoadState<ProductsListResponse>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const { enabled = true } = options
    if (!enabled) {
      setState((s) => ({ ...s, loading: false }))
      return
    }

    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchProductsList(options)
      .then((data) => {
        if (cancelled) return
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Ошибка загрузки',
        })
      })

    return () => {
      cancelled = true
    }
  }, [
    options.q,
    options.category,
    options.sort,
    options.page,
    options.limit,
    options.enabled,
  ])

  return state
}
