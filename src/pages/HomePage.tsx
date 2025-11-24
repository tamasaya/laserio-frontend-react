import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-laser-blue to-sky-700 px-8 py-10 text-white shadow-card">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Каталог лазерных и оптоэлектронных компонентов
            </h1>
            <p className="mb-6 text-sm text-sky-100/90">
              Подберите тепловизионные системы, оптику, навигационные
              модули и другую высокотехнологичную продукцию для ваших
              проектов.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/catalog"
                className="rounded-full bg-white px-5 py-2 font-semibold text-laser-blue shadow-md"
              >
                Перейти к каталогу
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-sky-200/70 bg-white/5 px-5 py-2 text-sky-100 hover:bg-white/10"
              >
                Поиск товара
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-white/5 p-4 text-xs text-sky-100/90 ring-1 ring-sky-500/30">
            <span>• Каталог из десятков специализированных разделов</span>
            <span>• Подробные описания и технические характеристики</span>
            <span>• Документация и поддержка инженеров</span>
          </div>
        </div>
      </section>
    </div>
  )
}




