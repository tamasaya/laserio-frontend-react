import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/States'
import { useProduct } from '../lib/hooks'
import { useCartStore } from '../store/cartStore'

export function ProductPage() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useProduct(slug)
  const add = useCartStore((s) => s.add)

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

  if (loading) {
    return <LoadingState message="Загружаем карточку товара..." />
  }

  if (error || !data) {
    return (
      <ErrorState message={error || 'Товар не найден или недоступен.'} />
    )
  }

  const priceLabel =
    !data.price || data.price === 0
      ? 'Цена по запросу'
      : `${data.price.toLocaleString('ru-RU')} ₽`

  const images = [
    data.primary_image_url,
    ...(data.gallery_images ?? []),
  ].filter(Boolean) as string[]

  return (
    <div className="space-y-8 rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200">
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
        <div>
          <div className="mb-3 text-xs font-medium text-slate-500">
            Тепловизионные системы и комплектующие (40шт)
          </div>
          <h1 className="mb-4 text-2xl font-semibold text-slate-900">
            {data.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-xl font-semibold text-laser-blue">
              {priceLabel}
            </div>
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
          {images.length > 0 && (
            <div className="flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
              <img
                src={images[0]}
                alt={data.name}
                className="h-full w-full object-contain"
              />
            </div>
          )}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(1, 4).map((img) => (
                <div
                  key={img}
                  className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-50"
                >
                  <img
                    src={img}
                    alt={data.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductTabs
        descriptionHtml={data.content_html}
        specsHtml={data.specs_html}
        docUrl={data.doc_url}
      />
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

        {active === 'specs' && specsHtml && (
          <div dangerouslySetInnerHTML={{ __html: specsHtml }} />
        )}
        {active === 'specs' && !specsHtml && (
          <p className="text-sm text-slate-500">
            Технические характеристики пока недоступны.
          </p>
        )}

        {active === 'docs' && (
          <div>
            {docUrl ? (
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-laser-accent hover:text-sky-700"
              >
                Скачать документацию
              </a>
            ) : (
              <p className="text-sm text-slate-500">
                Документация пока недоступна.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


