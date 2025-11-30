import type { ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CartBadge } from '../cart/CartBadge'
import { Breadcrumbs } from '../navigation/Breadcrumbs'
import { GlobalProductSearch } from '../products/GlobalProductSearch'
import { useToastStore } from '../../store/toastStore'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  const isHome = location.pathname === '/'

  return (
    <>
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-end gap-2 px-4 sm:top-20">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto flex max-w-xs items-start gap-2 rounded-xl bg-slate-900/95 px-4 py-3 text-xs text-slate-50 shadow-lg ring-1 ring-slate-700/80"
            >
              <div
                className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                  toast.type === 'success'
                    ? 'bg-emerald-400'
                    : 'bg-rose-400'
                }`}
              />
              <div className="flex-1">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-[11px] text-slate-300 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <header className="gradient-header text-white fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-5">
          <div className="flex items-center gap-10">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3"
            >
              <div className="hidden flex-col text-left sm:flex">
                <span className="text-xs uppercase tracking-[0.25em] text-white">
                  LAZER DETAILS
                </span>
              </div>
            </button>

            <nav className="hidden items-center gap-6 text-sm text-sky-100/90 md:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                Главная
              </NavLink>
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                Карта категорий
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                Каталог
              </NavLink>
              <NavLink
                to="/contacts"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                Контакты
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <GlobalProductSearch />

            <CartBadge />
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-24">
      <main className="page-inner">
        {!isHome && (
          <div className="mb-4">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>

      <footer className="mt-auto gradient-header-reverse py-6 text-xs ">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white">
              LAZER DETAILS
            </span>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}


