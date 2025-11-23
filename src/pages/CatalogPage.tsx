import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
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

type SortKey =
  | 'new'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'

export function CatalogPage() {
  const { slug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = (searchParams.get('sort') as SortKey | null) ?? 'new'
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

  const isLeaf = useMemo(() => {
    if (!data) return false
    return (data as PaginatedProductsResponse).products !== undefined
  }, [data])

  const onSortChange = (value: SortKey) => {
    searchParams.set('sort', value)
    searchParams.set('page', '1')
    setSearchParams(searchParams, { replace: true })
  }

  const onPageChange = (next: number) => {
    searchParams.set('page', String(next))
    setSearchParams(searchParams, { replace: true })
  }

  const sortedProducts = useMemo(() => {
    if (!isLeaf || !data) return []
    const resp = data as PaginatedProductsResponse
    const products = [...resp.products]
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_desc':
        products.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name_asc':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        products.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }
    return products
  }, [data, isLeaf, sort])

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {slug}
            </h1>
            {data && !isLeaf && (
              <p className="text-xs text-slate-500">
                {(data as CategoryDetailNonLeaf).category.name}
              </p>
            )}
          </div>
          {isLeaf && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Сортировка:</span>
              <select
                value={sort}
                onChange={(e) =>
                  onSortChange(e.target.value as SortKey)
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
              >
                <option value="new">Сначала новые</option>
                <option value="price_asc">Цена ↑</option>
                <option value="price_desc">Цена ↓</option>
                <option value="name_asc">Название A–Я</option>
                <option value="name_desc">Название Я–A</option>
              </select>
            </div>
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
              />
            )}
            {isLeaf && (
              <>
                <ProductsGrid products={sortedProducts} />
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
              <h2 className="text-sm font-semibold text-slate-900">
                {child.name}
              </h2>
              <p className="text-xs text-slate-500">
                {child.desc_product_count} товаров
              </p>
            </div>
          </div>
          {child.products_preview.length === 0 ? (
            <p className="text-xs text-slate-500">
              Нет предварительных товаров.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {child.products_preview.slice(0, 3).map((p) => (
                <div
                  key={p.slug}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700"
                >
                  <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-slate-50 mb-2">
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
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}


