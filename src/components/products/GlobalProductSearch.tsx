import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProductsList } from '../../lib/hooks'

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const

export function GlobalProductSearch() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    20,
  )
  const navigate = useNavigate()

  const enabled = query.trim().length > 0

  const { data, loading, error } = useProductsList({
    q: query || undefined,
    sort: 'new',
    page,
    limit: pageSize,
    enabled,
  })

  const meta = data?.meta
  const products = data?.products ?? []

  const handleChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(
      `/products?${new URLSearchParams({
        q: query,
        page: '1',
        limit: String(pageSize),
      }).toString()}`,
    )
  }

  const showDropdown = enabled

  return (
    <div className="relative hidden sm:block">
      <form
        onSubmit={handleSubmit}
        className="flex items-center rounded-full bg-white/5 px-3 py-1.5 text-xs text-sky-100 shadow-sm ring-1 ring-white/15"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Поиск товара по каталогу"
          className="w-52 border-none bg-transparent text-xs text-sky-50 placeholder:text-sky-200/70 focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-laser-blue hover:bg-white"
        >
          Искать
        </button>
      </form>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-[360px] rounded-2xl bg-white/95 p-3 text-xs text-slate-800 shadow-card ring-1 ring-slate-200">
          {loading && (
            <div className="p-2 text-slate-500">Ищем товары...</div>
          )}
          {error && (
            <div className="p-2 text-rose-600">
              Ошибка загрузки: {error}
            </div>
          )}
          {!loading && !error && products.length === 0 && (
            <div className="p-2 text-slate-500">
              Ничего не найдено по запросу «{query}».
            </div>
          )}
          {!loading && !error && products.length > 0 && (
            <>
              <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {products.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${encodeURIComponent(p.slug)}`}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                        {p.primary_image_url ? (
                          <img
                            src={p.primary_image_url}
                            alt={p.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Нет фото
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-medium text-slate-900">
                          {p.name}
                        </div>
                        {p.price ? (
                          <div className="text-[11px] text-slate-500">
                            {p.price.toLocaleString('ru-RU')} ₽
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">
                            Цена по запросу
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {meta && (
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={meta.page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-full border border-slate-300 bg-white px-2 py-0.5 disabled:opacity-40"
                    >
                      ‹
                    </button>
                    <span>
                      {meta.page}/{meta.pages}
                    </span>
                    <button
                      type="button"
                      disabled={meta.page >= meta.pages}
                      onClick={() =>
                        setPage((p) =>
                          meta.pages ? Math.min(meta.pages, p + 1) : p + 1,
                        )
                      }
                      className="rounded-full border border-slate-300 bg-white px-2 py-0.5 disabled:opacity-40"
                    >
                      ›
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>По:</span>
                    <select
                      value={pageSize}
                      onChange={(e) =>
                        setPageSize(
                          (Number(e.target.value) ||
                            20) as (typeof PAGE_SIZE_OPTIONS)[number],
                        )
                      }
                      className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                      {PAGE_SIZE_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}


