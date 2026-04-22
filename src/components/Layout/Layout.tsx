import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { CartBadge } from "../cart/CartBadge";
import { Breadcrumbs } from "../navigation/Breadcrumbs";
import { GlobalProductSearch } from "../products/GlobalProductSearch";
import { useToastStore } from "../../store/toastStore";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  const isHome = location.pathname === "/";
  const isProductPage = location.pathname.startsWith("/products/");

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
                  toast.type === "success" ? "bg-emerald-400" : "bg-rose-400"
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
              onClick={() => navigate("/")}
              className="flex items-center gap-3"
            >
              <img
                src="/Frame%20839.svg"
                alt="LAZER DETAILS"
                className="h-10 w-auto"
              />
              <span className="sr-only">LAZER DETAILS</span>
            </button>

            <nav className="hidden items-center gap-6 text-sm text-sky-100/90 md:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Главная
              </NavLink>
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Карта категорий
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Каталог
              </NavLink>
              <NavLink
                to="/contacts"
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                Контакты
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <GlobalProductSearch />

            {/* <CartBadge /> */}
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-24 flex min-h-screen flex-col">
        <main className="page-inner flex-1">
          {!isHome && (
            <div className="mb-4 flex items-center justify-between">
              {isProductPage ? (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  <span className="text-sm">←</span>
                  <span>Назад</span>
                </button>
              ) : (
                <Breadcrumbs />
              )}
            </div>
          )}
          {children}
        </main>

        <footer className="gradient-header-reverse py-6 text-xs text-sky-50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/Frame%20839.svg"
                  alt="LAZER DETAILS"
                  className="h-8 w-auto"
                />
                <div className="hidden flex-col text-left sm:flex">
                  <span className="text-[11px] uppercase tracking-[0.2em]">
                    LAZER DETAILS
                  </span>
                  <span className="mt-1 text-[11px] text-sky-100/80">
                    Промышленные лазерные комплектующие и решения
                  </span>
                </div>
              </div>

              <div className="grid gap-4 text-[11px] sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="font-semibold uppercase tracking-wide text-sky-100/90">
                    Контакты
                  </div>
                  <div className="space-y-1">
                    <div>
                      Отдел продаж:{" "}
                      <a
                        href="tel:+74951234567"
                        className="text-sky-100 hover:text-white"
                      >
                        +7 (495) 123‑45‑67
                      </a>
                    </div>
                    <div>
                      Техподдержка:{" "}
                      <a
                        href="tel:+74959876543"
                        className="text-sky-100 hover:text-white"
                      >
                        +7 (495) 987‑65‑43
                      </a>
                    </div>
                    <div>
                      Email:{" "}
                      <a
                        href="mailto:info@test.ru"
                        className="text-sky-100 hover:text-white"
                      >
                        info@test.ru
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold uppercase tracking-wide text-sky-100/90">
                    Адрес
                  </div>
                  <div className="text-sky-100/90">
                    г. Москва, м. Чистые пруды
                    <br />
                    Лучевой переулок, д. 7, офис 12
                    <br />
                    Пн–Пт: 9:00 – 18:00
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold uppercase tracking-wide text-sky-100/90">
                    Разделы сайта
                  </div>
                  <nav className="flex flex-col gap-1">
                    <NavLink
                      to="/catalog"
                      className="text-sky-100/90 hover:text-white"
                    >
                      Карта категорий
                    </NavLink>
                    <NavLink
                      to="/products"
                      className="text-sky-100/90 hover:text-white"
                    >
                      Каталог товаров
                    </NavLink>
                    <NavLink
                      to="/contacts"
                      className="text-sky-100/90 hover:text-white"
                    >
                      Контакты
                    </NavLink>
                  </nav>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-sky-200/20 pt-3 text-[10px] text-sky-100/70">
              © {new Date().getFullYear()} LAZER DETAILS. Все права защищены.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
