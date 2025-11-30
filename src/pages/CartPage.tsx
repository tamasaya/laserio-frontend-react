import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export function CartPage() {
  const items = useCartStore((s) => s.items)
  const remove = useCartStore((s) => s.remove)
  const setQty = useCartStore((s) => s.setQty)
  const clear = useCartStore((s) => s.clear)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white/95 p-6 text-sm text-slate-600 shadow-card ring-1 ring-slate-200">
        <p className="mb-4">
          В заявке пока нет товаров. Добавьте интересующие позиции из
          каталога.
        </p>
        <Link
          to="/catalog"
          className="text-sm font-semibold text-laser-accent"
        >
          Перейти к каталогу →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Заявка
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-slate-500 hover:text-rose-500"
        >
          Очистить
        </button>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-20 w-24 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {item.product.primary_image_url ? (
                  <img
                    src={item.product.primary_image_url}
                    alt={item.product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Нет изображения
                  </span>
                )}
              </div>
              <div className="text-sm font-medium text-slate-900">
                {item.product.name}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
                <button
                  type="button"
                  className="px-2 text-xs"
                  onClick={() =>
                    setQty(item.product.id, Math.max(1, item.qty - 1))
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    setQty(
                      item.product.id,
                      Number(e.target.value) || 1,
                    )
                  }
                  className="w-12 border-none bg-transparent text-center text-xs focus:outline-none"
                />
                <button
                  type="button"
                  className="px-2 text-xs"
                  onClick={() => setQty(item.product.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(item.product.id)}
                className="text-xs text-rose-500"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-end gap-2 text-sm">
        <Link
          to="/checkout"
          className="mt-2 inline-flex rounded-full bg-laser-blue px-6 py-2 text-sm font-semibold text-sky-50 hover:bg-laser-blue-light"
        >
          Оформить заявку
        </Link>
      </div>
    </div>
  )
}




