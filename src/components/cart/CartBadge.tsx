import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

export function CartBadge() {
  const count = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.qty, 0),
  )

  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center justify-center rounded-full bg-white text-xs font-semibold text-laser-blue px-3 py-1.5 shadow-card"
      aria-label={`Корзина, позиций: ${count}`}
    >
      <span className="mr-2 h-2 w-2 rounded-full bg-laser-accent" />
      <span>Заявка</span>
      <span className="ml-2 rounded-full bg-laser-blue text-[10px] px-1.5 py-0.5 text-sky-50 min-w-[1.3rem] text-center">
        {count}
      </span>
    </Link>
  )
}


