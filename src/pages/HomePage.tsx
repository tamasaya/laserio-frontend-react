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
                to="/categories"
                className="rounded-full bg-white px-5 py-2 font-semibold text-laser-blue shadow-md"
              >
                Открыть карту каталога
              </Link>
              <Link
                to="/catalog/teplovizionnye-sistemy"
                className="rounded-full border border-sky-200/70 bg-white/5 px-5 py-2 text-sky-100 hover:bg-white/10"
              >
                Тепловизионные системы
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

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Разделы каталога
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <HomeCard
            title="Каталог по разделам"
            description="Переходите к дереву категорий и находите нужный класс оборудования."
            to="/categories"
          />
          <HomeCard
            title="Тепловизионные системы"
            description="Охлаждаемые и неохлаждаемые камеры, модули и комплектующие."
            to="/catalog/teplovizionnye-sistemy"
          />
          <HomeCard
            title="Оборудование для микроэлектроники"
            description="Решения для измерений, испытаний и производства."
            to="/catalog/oborudovanie-dlya-mikroelektroniki"
          />
        </div>
      </section>
    </div>
  )
}

type HomeCardProps = {
  title: string
  description: string
  to: string
}

function HomeCard({ title, description, to }: HomeCardProps) {
  return (
    <Link
      to={to}
      className="flex flex-col justify-between rounded-2xl bg-white/90 p-5 text-sm text-slate-700 shadow-card ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-lg transition"
    >
      <div>
        <h3 className="mb-2 text-base font-semibold text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <span className="mt-4 text-xs font-semibold text-laser-accent">
        Открыть →
      </span>
    </Link>
  )
}




