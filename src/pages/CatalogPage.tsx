import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CategoryTree } from '../components/categories/CategoryTree'
import { ErrorState, LoadingState } from '../components/common/States'
import { ProductsGrid } from '../components/products/ProductsGrid'
import {
  type CategoryChildPreview,
  type CategoryDetailNonLeaf,
  type CategoryNode,
  type PaginatedProductsResponse,
  type ProductSummary,
  fetchCategoryProducts,
} from '../lib/api'
import { useCategoryDetail, useCategoryTree } from '../lib/hooks'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

export function CatalogPage() {
  const { slug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1') || 1
  const [activeDescription, setActiveDescription] = useState<{
    title: string
    html: string
  } | null>(null)

  const {
    data: tree,
    loading: treeLoading,
    error: treeError,
  } = useCategoryTree()
  const {
    data,
    loading: detailLoading,
    error: detailError,
  } = useCategoryDetail(slug, page)

  const categoryData =
    data && 'category' in data ? (data as CategoryDetailNonLeaf | PaginatedProductsResponse).category : null

  const categoryName =
    categoryData?.name ??
    decodeURIComponent(slug).replace(/-/g, ' ')

  const rootDescription = categoryData?.description ?? null

  // Кладём название категории в sessionStorage, чтобы хлебные крошки
  // могли показывать name вместо slug.
  useEffect(() => {
    if (!data || !('category' in data)) return
    try {
      window.sessionStorage.setItem(
        `catName:${data.category.slug}`,
        data.category.name,
      )
    } catch {
      // ignore
    }
  }, [data])

  const isLeaf = useMemo(() => {
    if (!data) return false
    return (data as PaginatedProductsResponse).products !== undefined
  }, [data])

  const onPageChange = (next: number) => {
    searchParams.set('page', String(next))
    setSearchParams(searchParams, { replace: true })
  }

  const meta =
    isLeaf && data
      ? (data as PaginatedProductsResponse).meta
      : undefined

  useEffect(() => {
    if (!activeDescription) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setActiveDescription(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [activeDescription])

  return (
    <div className="grid gap-6 md:grid-cols-[280px,1fr]">
      <aside className="space-y-4">
        {treeLoading && (
          <LoadingState message="Загружаем дерево категорий..." />
        )}
        {treeError && <ErrorState message={treeError} />}
        {tree && <CategoryTree tree={tree as CategoryNode[]} />}
      </aside>

      <section className="relative space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 md:text-2xl">
              {categoryName}
            </h1>
            {data && isLeaf && 'meta' in (data as PaginatedProductsResponse) && (
              <p className="text-xs text-slate-500">
                {(data as PaginatedProductsResponse).meta?.total ?? 0} товаров
              </p>
            )}
          </div>
          {rootDescription && (
            <button
              type="button"
              onClick={() =>
                setActiveDescription({
                  title: categoryName,
                  html: rootDescription,
                })
              }
              className="text-[11px] font-medium text-laser-accent hover:text-sky-700"
            >
              Описание →
            </button>
          )}
        </div>

        {detailLoading && (
          <LoadingState message="Загружаем товары категории..." />
        )}
        {detailError && <ErrorState message={detailError} />}

        {data && !detailLoading && !detailError && (
          <>
            {!isLeaf && (
                <NonLeafView
                  detail={data as CategoryDetailNonLeaf}
                  onShowDescription={(title, html) =>
                    setActiveDescription({ title, html })
                  }
                />
            )}
            {isLeaf && (
              <>
                <ProductsGrid
                  products={
                    (data as PaginatedProductsResponse).products
                  }
                />
                {meta && meta.pages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-600">
                    <button
                      type="button"
                      disabled={meta.page <= 1}
                      onClick={() => onPageChange(meta.page - 1)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 disabled:opacity-40"
                    >
                      Назад
                    </button>
                    <span>
                      Страница {meta.page} из {meta.pages}
                    </span>
                    <button
                      type="button"
                      disabled={meta.page >= meta.pages}
                      onClick={() => onPageChange(meta.page + 1)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 disabled:opacity-40"
                    >
                      Вперед
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeDescription && (
          <div className="fixed inset-0 z-30 flex justify-end bg-slate-900/30">
            <div className=" sm:mt-16 flex h-[calc(100%-5rem)] w-full max-w-6xl flex-col bg-white shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
                <button
                  type="button"
                  aria-label="Закрыть описание"
                  onClick={() => setActiveDescription(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                >
                  ×
                </button>
                <h2 className="truncate text-sm font-semibold text-slate-900">
                  {activeDescription.title}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div
                  className="prose prose-sm max-w-none text-slate-700 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1"
                  dangerouslySetInnerHTML={{ __html: activeDescription.html }}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

type NonLeafViewProps = {
  detail: CategoryDetailNonLeaf
  onShowDescription: (title: string, html: string) => void
}

function NonLeafView({ detail, onShowDescription }: NonLeafViewProps) {
  return (
    <div className="space-y-8">
      {detail.children.map((child: CategoryChildPreview) => (
        <ChildCategorySection
          key={child.id}
          child={child}
          onShowDescription={onShowDescription}
        />
      ))}
    </div>
  )
}

type ChildCategorySectionProps = {
  child: CategoryChildPreview
}

function ChildCategorySection({
  child,
  onShowDescription,
}: ChildCategorySectionProps & {
  onShowDescription: (title: string, html: string) => void
}) {
  const addToCart = useCartStore((s) => s.add)
  const showToast = useToastStore((s) => s.showToast)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allProducts, setAllProducts] = useState<ProductSummary[] | null>(
    null,
  )

  const previewProducts = useMemo(() => {
    if (allProducts && allProducts.length > 0) {
      return allProducts.slice(0, 3)
    }
    return child.products_preview.map((p) => ({
      id: 0,
      name: p.name,
      slug: p.slug,
      primary_image_url: p.primary_image_url,
    })) as unknown as ProductSummary[]
  }, [allProducts, child.products_preview])

  const extraProducts = useMemo(() => {
    if (!allProducts) return []
    if (allProducts.length <= 3) return []
    return allProducts.slice(3)
  }, [allProducts])

  const handleToggle = () => {
    const next = !expanded
    setExpanded(next)
    if (next && !loading && !error && !allProducts) {
      setLoading(true)
      fetchCategoryProducts(child.slug)
        .then((resp) => {
          setAllProducts(resp.products)
          setLoading(false)
        })
        .catch((e: unknown) => {
          setError(
            e instanceof Error
              ? e.message
              : 'Не удалось загрузить товары категории.',
          )
          setLoading(false)
        })
    }
  }

  const showPreview = child.products_preview.length > 0

  return (
    <section className="rounded-2xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <Link
            to={`/catalog/${encodeURIComponent(child.slug)}`}
            className="text-sm font-semibold text-slate-900 hover:text-laser-accent"
          >
            {child.name}
          </Link>
          <p className="text-xs text-slate-500">
            {child.desc_product_count} товаров
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[11px]">
          <button
            type="button"
            onClick={() =>
              onShowDescription(
                child.name,
                child.description ||
                  '<p>Описание для этой категории пока недоступно.</p>',
              )
            }
            className="font-medium text-laser-accent hover:text-sky-700"
          >
            Описание →
          </button>
          {child.desc_product_count > child.products_preview.length && (
            <button
              type="button"
              onClick={handleToggle}
              className="rounded-full border border-laser-accent px-3 py-1 text-[11px] font-medium text-laser-accent hover:bg-laser-accent hover:text-white"
            >
              {expanded ? 'Скрыть товары' : 'Показать все товары'}
            </button>
          )}
        </div>
      </div>

      {!showPreview ? (
        <p className="text-xs text-slate-500">
          Нет предварительных товаров.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {previewProducts.map((p) => (
            <Link
              key={p.slug}
              to={`/products/${encodeURIComponent(p.slug)}`}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 hover:border-laser-accent hover:shadow-card transition"
            >
              <div className="mb-2 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {p.primary_image_url ? (
                  <img
                    src={p.primary_image_url}
                    alt={p.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Нет изображения
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <span className="mb-2 line-clamp-2 text-xs font-medium text-slate-800">
                  {p.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart({
                      id: p.id || 0,
                      name: p.name,
                      slug: p.slug,
                      primary_image_url: p.primary_image_url,
                    })
                    showToast('success', 'Товар добавлен в заявку.')
                  }}
                  className="mt-auto self-start rounded-full bg-laser-blue px-3 py-1 text-[11px] font-semibold text-sky-50 hover:bg-laser-blue-light"
                >
                  В заявку
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {expanded && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          {loading && (
            <p className="text-[11px] text-slate-500">
              Загружаем остальные товары...
            </p>
          )}
          {error && (
            <p className="text-[11px] text-rose-600">
              {error}
            </p>
          )}
          {!loading && !error && extraProducts.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Все товары уже показаны выше.
            </p>
          )}
          {!loading && !error && extraProducts.length > 0 && (
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {extraProducts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${encodeURIComponent(p.slug)}`}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 hover:border-laser-accent hover:shadow-card transition"
                >
                  <div className="mb-2 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                    {p.primary_image_url ? (
                      <img
                        src={p.primary_image_url}
                        alt={p.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Нет изображения
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="mb-1 line-clamp-2 text-xs font-medium text-slate-800">
                      {p.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart({
                          id: p.id,
                          name: p.name,
                          slug: p.slug,
                          primary_image_url: p.primary_image_url,
                        })
                        showToast('success', 'Товар добавлен в заявку.')
                      }}
                      className="mt-auto self-start rounded-full bg-laser-blue px-3 py-1 text-[11px] font-semibold text-sky-50 hover:bg-laser-blue-light"
                    >
                      В заявку
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}


