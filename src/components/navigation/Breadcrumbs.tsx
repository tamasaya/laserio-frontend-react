import { Link, useLocation } from 'react-router-dom'

export function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const items = [
    { label: 'Главная', path: '/' },
    ...segments.map((seg, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/')
      return { label: decodeURIComponent(seg), path }
    }),
  ]

  if (items.length <= 1) return null

  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-xs text-slate-500"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 && <span className="text-slate-400">/</span>}
              {isLast ? (
                <span className="text-slate-600">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-sky-700 hover:text-sky-900"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}


