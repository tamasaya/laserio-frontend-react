import type { ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CartBadge } from '../cart/CartBadge'
import { Breadcrumbs } from '../navigation/Breadcrumbs'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  return (
    <>
      <header className="gradient-header text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-5">
          <div className="flex items-center gap-10">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-400/40 bg-white/5">
                <span className="text-xs font-semibold tracking-[0.15em]">
                  LASER
                </span>
              </div>
              <div className="hidden flex-col text-left sm:flex">
                <span className="text-xs uppercase tracking-[0.25em] text-sky-200">
                  Laser &amp; Opto
                </span>
                <span className="text-sm font-medium text-sky-50">
                  Components Catalog
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
                to="/categories"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                Карта каталога
              </NavLink>
              <span className="text-xs text-sky-200/70">Новости</span>
              <span className="text-xs text-sky-200/70">Блог</span>
              <span className="text-xs text-sky-200/70">Сервис</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 text-xs text-sky-100/90 sm:flex">
              <span>Почта</span>
              <span className="opacity-50">|</span>
              <span>телефон</span>
            </div>

            <div className="relative hidden items-center rounded-full bg-white/5 px-4 py-1.5 text-xs text-sky-100 shadow-sm ring-1 ring-white/10 sm:flex">
              <span className="mr-2 text-sky-200/70">Поиск</span>
              <span className="h-5 w-px bg-sky-300/40" />
              <span className="ml-2 text-[11px] uppercase tracking-wide text-sky-100/70">
                каталога
              </span>
            </div>

            <Link
              to="/cart"
              className="hidden rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-sky-50 shadow-sm ring-1 ring-sky-500/60 hover:bg-sky-500/80 md:inline-flex"
            >
              Заявки
            </Link>

            <CartBadge />
          </div>
        </div>
      </header>

      <main className="page-inner">
        {!isHome && (
          <div className="mb-4">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </main>

      <footer className="mt-auto bg-laser-blue-dark py-6 text-xs text-sky-100/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex gap-6">
            <span className="cursor-default hover:text-white">
              Контакты
            </span>
            <span className="cursor-default hover:text-white">Адрес</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-sky-200/80">
            <span>Доставка и оплата</span>
            <span>Пользовательское соглашение</span>
            <span>Политика конфиденциальности</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/70">
              <span className="text-[9px] font-semibold tracking-[0.22em]">
                LASER
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">
              Components
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}


