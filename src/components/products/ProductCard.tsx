import { Link } from 'react-router-dom'
import type { ProductSummary } from '../../lib/api'
import { normalizeImageUrl } from '../../lib/api'
import { useCartStore } from '../../store/cartStore'

type ProductCardProps = {
  product: ProductSummary
}

export function ProductCard({ product }: ProductCardProps) {
  const add = useCartStore((s) => s.add)

  const priceLabel =
    !product.price || product.price === 0
      ? 'Цена по запросу'
      : `${product.price.toLocaleString('ru-RU')} ₽`

  const imageUrl = normalizeImageUrl(
    product.primary_image_url ?? product.image ?? null,
  )

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-card ring-1 ring-slate-200">
      <Link
        to={`/products/${encodeURIComponent(product.slug)}`}
        className="flex flex-1 flex-col"
      >
        <div className="flex h-44 items-center justify-center overflow-hidden rounded-t-2xl bg-slate-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-xs text-slate-400">
              Нет изображения
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col px-4 py-3">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-800">
            {product.name}
          </h3>
          <p className="mt-auto text-sm font-medium text-laser-blue">
            {priceLabel}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <button
          type="button"
          className="rounded-full bg-laser-blue text-xs font-semibold text-sky-50 px-3 py-1.5 hover:bg-laser-blue-light"
          onClick={() =>
            add({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              primary_image_url: product.primary_image_url,
            })
          }
        >
          В заявку
        </button>
        <Link
          to={`/products/${encodeURIComponent(product.slug)}`}
          className="text-xs font-medium text-laser-accent hover:text-sky-600"
        >
          Подробнее →
        </Link>
      </div>
    </div>
  )
}




