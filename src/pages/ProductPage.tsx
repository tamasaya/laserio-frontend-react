import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/States'
import { useProduct } from '../lib/hooks'
import { normalizeImageUrl } from '../lib/api'
import { useCartStore } from '../store/cartStore'

export function ProductPage() {
  const { slug = '' } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef<{
    x: number
    y: number
    ox: number
    oy: number
  } | null>(null)
  const { data, loading, error } = useProduct(slug)
  const add = useCartStore((s) => s.add)

  const closeViewer = () => {
    setIsViewerOpen(false)
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
    setIsPanning(false)
    panStartRef.current = null
  }

  useEffect(() => {
    if (!data) return
    try {
      window.sessionStorage.setItem(
        `prodName:${data.slug}`,
        data.name,
      )
    } catch {
      // ignore
    }
  }, [data])

  useEffect(() => {
    if (!data) return
    setActiveIndex(0)
    setViewerIndex(0)
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
    setIsPanning(false)
  }, [data?.id])

  useEffect(() => {
    if (!isViewerOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeViewer()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isViewerOpen])

  if (loading) {
    return <LoadingState message="Загружаем карточку товара..." />
  }

  if (error || !data) {
    return (
      <ErrorState message={error || 'Товар не найден или недоступен.'} />
    )
  }

  const galleryUrls =
    data.gallery?.map((img) => normalizeImageUrl(img.url)) ?? []

  const allImages = [
    normalizeImageUrl(data.primary_image_url),
    ...galleryUrls,
  ].filter(
    (url, index, arr): url is string =>
      !!url && arr.indexOf(url) === index,
  )

  return (
    <div className="space-y-8 rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200">
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
        <div>
          <h1 className="mb-4 text-2xl font-semibold text-slate-900">
            {data.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() =>
                add({
                  id: data.id,
                  name: data.name,
                  slug: data.slug,
                  price: data.price,
                  primary_image_url: data.primary_image_url,
                })
              }
              className="rounded-full bg-laser-blue px-6 py-2 text-sm font-semibold text-sky-50 hover:bg-laser-blue-light"
            >
              Добавить в заявку
            </button>
            {data.doc_url && (
              <a
                href={data.doc_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-laser-accent hover:text-sky-700"
              >
                Скачать документацию
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          {allImages.length > 0 ? (
            <>
              <div className="relative flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setViewerIndex(activeIndex)
                    setZoom(1)
                    setRotation(0)
                    setOffset({ x: 0, y: 0 })
                    setIsPanning(false)
                    panStartRef.current = null
                    setIsViewerOpen(true)
                  }}
                  className="flex h-full w-full items-center justify-center"
                >
                  <img
                    src={allImages[activeIndex]}
                    alt={data.name}
                    className="h-full w-full object-contain"
                  />
                </button>
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Предыдущее изображение"
                      onClick={() =>
                        setActiveIndex((prev) =>
                          prev === 0 ? allImages.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700 shadow hover:bg-white"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Следующее изображение"
                      onClick={() =>
                        setActiveIndex((prev) =>
                          prev === allImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700 shadow hover:bg-white"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="mt-2 flex max-w-md gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, index) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`flex h-16 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-50 ${
                        index === activeIndex
                          ? 'border-laser-blue'
                          : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={data.name}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-64 w-full max-w-md items-center justify-center rounded-2xl bg-slate-50 text-xs text-slate-400">
              Нет изображений
            </div>
          )}
        </div>
      </div>

      <ProductTabs
        descriptionHtml={data.content_html}
        specsHtml={data.specs_html}
        docUrl={data.doc_url}
      />

      {isViewerOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            type="button"
            aria-label="Закрыть просмотр"
            onClick={closeViewer}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg text-white hover:bg-white/20"
          >
            ×
          </button>
          <div className="flex max-h-full max-w-4xl flex-col gap-4 rounded-2xl bg-slate-900/90 p-4 text-xs text-slate-100 shadow-2xl">
            <div
              className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-950/60"
              onWheel={(e) => {
                e.preventDefault()
                const delta = e.deltaY < 0 ? 0.03 : -0.03
                setZoom((current) => {
                  const next = Math.min(3, Math.max(0.5, current + delta))
                  if (next === 1) {
                    setOffset({ x: 0, y: 0 })
                  }
                  return Number(next.toFixed(2))
                })
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                setIsPanning(true)
                panStartRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  ox: offset.x,
                  oy: offset.y,
                }
              }}
              onMouseMove={(e) => {
                if (!isPanning || !panStartRef.current) return
                e.preventDefault()
                const { x, y, ox, oy } = panStartRef.current
                const dx = e.clientX - x
                const dy = e.clientY - y
                setOffset({ x: ox + dx, y: oy + dy })
              }}
              onMouseUp={() => {
                setIsPanning(false)
                panStartRef.current = null
              }}
              onMouseLeave={() => {
                setIsPanning(false)
                panStartRef.current = null
              }}
            >
              <img
                src={allImages[viewerIndex]}
                alt={data.name}
                className="max-h-full max-w-full select-none"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 150ms ease-out',
                }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewerIndex((prev) =>
                      prev === 0 ? allImages.length - 1 : prev - 1,
                    )
                  }
                  className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                >
                  ‹ Назад
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewerIndex((prev) =>
                      prev === allImages.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                >
                  Вперёд ›
                </button>
                <span className="text-[11px] text-slate-300">
                  {viewerIndex + 1} / {allImages.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) => {
                      const next = Math.max(
                        0.5,
                        Number((z - 0.25).toFixed(2)),
                      )
                      if (next === 1) {
                        setOffset({ x: 0, y: 0 })
                      }
                      return next
                    })
                  }
                  className="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                >
                  −
                </button>
                <span className="w-10 text-center text-[11px]">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) =>
                      Math.min(3, Number((z + 0.25).toFixed(2))),
                    )
                  }
                  className="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1)
                    setRotation(0)
                    setOffset({ x: 0, y: 0 })
                  }}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                >
                  Сброс
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRotation((r) => (r - 90 + 360) % 360)
                  }
                  className="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRotation((r) => (r + 90) % 360)
                  }
                  className="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                >
                  ↻
                </button>
                <a
                  href={allImages[viewerIndex]}
                  download
                  className="rounded-full bg-laser-accent px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-sky-300"
                >
                  Скачать
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type ProductTabsProps = {
  descriptionHtml?: string | null
  specsHtml?: string | null
  docUrl?: string | null
}

function ProductTabs({
  descriptionHtml,
  specsHtml,
  docUrl,
}: ProductTabsProps) {
  const hasSpecs = !!specsHtml
  const hasDocs = !!docUrl

  const [active, setActive] = useState<'description' | 'specs' | 'docs'>(
    'description',
  )

  return (
    <div>
      <div className="mb-3 flex gap-3 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActive('description')}
          className={`border-b-2 pb-2 ${
            active === 'description'
              ? 'border-laser-blue text-laser-blue'
              : 'border-transparent text-slate-500'
          }`}
        >
          Описание
        </button>
        {hasSpecs && (
          <button
            type="button"
            onClick={() => setActive('specs')}
            className={`border-b-2 pb-2 ${
              active === 'specs'
                ? 'border-laser-blue text-laser-blue'
                : 'border-transparent text-slate-500'
            }`}
          >
            Характеристики
          </button>
        )}
        {hasDocs && (
          <button
            type="button"
            onClick={() => setActive('docs')}
            className={`border-b-2 pb-2 ${
              active === 'docs'
                ? 'border-laser-blue text-laser-blue'
                : 'border-transparent text-slate-500'
            }`}
          >
            Документация
          </button>
        )}
      </div>

      <div className="prose max-w-none prose-sm text-slate-700 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1">
        {active === 'description' && descriptionHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}
        {active === 'description' && !descriptionHtml && (
          <p className="text-sm text-slate-500">
            Описание пока недоступно.
          </p>
        )}

        {active === 'specs' && hasSpecs && specsHtml && (
          <div dangerouslySetInnerHTML={{ __html: specsHtml }} />
        )}

        {active === 'docs' && hasDocs && (
          <div>
            <a
              href={docUrl ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-laser-accent hover:text-sky-700"
            >
              Скачать документацию
            </a>
          </div>
        )}
      </div>
    </div>
  )
}


