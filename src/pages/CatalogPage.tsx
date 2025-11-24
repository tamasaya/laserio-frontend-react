import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CategoryTree } from '../components/categories/CategoryTree'
import { ErrorState, LoadingState } from '../components/common/States'
import { ProductsGrid } from '../components/products/ProductsGrid'
import {
  type CategoryChildPreview,
  type CategoryDetailNonLeaf,
  type CategoryNode,
  type PaginatedProductsResponse,
} from '../lib/api'
import { useCategoryDetail, useCategoryTree } from '../lib/hooks'

export function CatalogPage() {
  const { slug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1') || 1

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

  const categoryName =
    data && 'category' in data
      ? data.category.name
      : decodeURIComponent(slug).replace(/-/g, ' ')

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

  return (
    <div className="grid gap-6 md:grid-cols-[280px,1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl bg-white/90 p-3 shadow-card ring-1 ring-slate-200">
          <input
            type="search"
            placeholder="Поиск по каталогу"
            className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs focus:border-laser-accent focus:outline-none"
          />
        </div>
        {treeLoading && (
          <LoadingState message="Загружаем дерево категорий..." />
        )}
        {treeError && <ErrorState message={treeError} />}
        {tree && <CategoryTree tree={tree as CategoryNode[]} />}
      </aside>

      <section className="space-y-4">
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
      </section>
    </div>
  )
}

type NonLeafViewProps = {
  detail: CategoryDetailNonLeaf
}

function NonLeafView({ detail }: NonLeafViewProps) {
  return (
    <div className="space-y-8">
      {detail.children.map((child: CategoryChildPreview) => (
        <section
          key={child.id}
          className="rounded-2xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200"
        >
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
            <Link
              to={`/catalog/${encodeURIComponent(child.slug)}`}
              className="text-[11px] font-medium text-laser-accent hover:text-sky-700"
            >
              Описание →
            </Link>
          </div>
          {child.products_preview.length === 0 ? (
            <p className="text-xs text-slate-500">
              Нет предварительных товаров.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {child.products_preview.slice(0, 3).map((p) => (
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}


