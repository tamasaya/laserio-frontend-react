import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/States'
import { SearchBar } from '../components/common/SearchBar'
import { ProductsGrid } from '../components/products/ProductsGrid'
import { useProductsList } from '../lib/hooks'

export function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const qParam = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1') || 1
  const limitParam = Number(searchParams.get('limit') ?? '20') || 20
  const pageSize = [20, 50, 100].includes(limitParam) ? limitParam : 20

  const [searchValue, setSearchValue] = useState(qParam)

  const { data, loading, error } = useProductsList({
    q: qParam || undefined,
    page,
    limit: pageSize,
  })

  const meta = data?.meta

  const products = useMemo(() => data?.products ?? [], [data])

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value && value.length > 0) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') {
      next.set('page', '1')
    }
    setSearchParams(next, { replace: true })
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParam('q', value || null)
  }

  const handlePageChange = (nextPage: number) => {
    updateParam('page', String(nextPage))
  }

  const handlePageSizeChange = (value: number) => {
    updateParam('limit', String(value))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200 md:flex-row md:items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 md:text-2xl">
            Все товары
          </h1>
          <p className="text-xs text-slate-500">
            Глобальный поиск по каталогу компонентов.
          </p>
          {meta && (
            <p className="mt-1 text-xs text-slate-500">
              Найдено товаров: {meta.total}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Поиск по наименованию или описанию"
          />
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">Показывать по:</span>
            <select
              value={pageSize}
              onChange={(e) =>
                handlePageSizeChange(Number(e.target.value) || 20)
              }
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <LoadingState message="Загружаем список товаров..." />
      )}
      {error && <ErrorState message={error} />}

      {data && !loading && !error && (
        <>
          <ProductsGrid products={products} />
          {meta && meta.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-600">
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => handlePageChange(meta.page - 1)}
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
                onClick={() => handlePageChange(meta.page + 1)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 disabled:opacity-40"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}


