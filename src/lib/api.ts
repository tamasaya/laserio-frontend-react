const API_BASE = 'https://tamasaya.ru/api/laserio'

export type CategoryNode = {
  id: number
  name: string
  slug: string
  children?: CategoryNode[]
}

export type CategoryTreeResponse = CategoryNode[]

export type CategoryChildPreview = {
  id: number
  name: string
  slug: string
  desc_product_count: number
  products_preview: {
    name: string
    slug: string
    primary_image_url: string | null
  }[]
}

export type FeaturedProduct = {
  id: number
  name: string
  slug: string
  price: number
  primary_image_url: string | null
  doc_url: string | null
}

export type CategoryDetailNonLeaf = {
  category: {
    id: number
    name: string
    slug: string
  }
  children: CategoryChildPreview[]
  featured: FeaturedProduct[]
}

export type PaginatedProductsResponse = {
  category: {
    id: number
    name: string
    slug: string
  }
  products: ProductSummary[]
  meta?: {
    page: number
    pages: number
    total: number
    per_page: number
  }
}

export type ProductSummary = {
  id: number
  name: string
  slug: string
  price: number
  primary_image_url: string | null
}

export type ProductDetail = {
  id: number
  name: string
  slug: string
  price: number
  primary_image_url: string | null
  gallery_images?: string[] | null
  content_html?: string | null
  specs_html?: string | null
  doc_url?: string | null
}

export type OrderPayload = {
  customer: {
    full_name: string
    company?: string
    email: string
    phone: string
    comment?: string
  }
  items: { product_id: number; qty: number }[]
}

export type OrderResponse = {
  id: number
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return (await res.json()) as T
}

export async function fetchCategoryTree(): Promise<CategoryTreeResponse> {
  const res = await fetch(`${API_BASE}/categories/tree`)
  return handleResponse<CategoryTreeResponse>(res)
}

export async function fetchCategoryDetail(
  slug: string,
  page?: number,
): Promise<CategoryDetailNonLeaf | PaginatedProductsResponse> {
  const params = new URLSearchParams()
  if (page && page > 1) {
    params.set('page', String(page))
  }
  const query = params.toString()
  const url = `${API_BASE}/categories/${encodeURIComponent(slug)}${
    query ? `?${query}` : ''
  }`
  const res = await fetch(url)
  return handleResponse(res)
}

export async function fetchProduct(slug: string): Promise<ProductDetail> {
  const res = await fetch(
    `${API_BASE}/products/${encodeURIComponent(slug)}`,
  )
  return handleResponse<ProductDetail>(res)
}

export async function postOrder(
  payload: OrderPayload,
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<OrderResponse>(res)
}


