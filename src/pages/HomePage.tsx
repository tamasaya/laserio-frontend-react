import { Link } from 'react-router-dom'
import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const trafficChartOptions: Options = {
  chart: {
    type: 'areaspline',
    backgroundColor: 'transparent',
    spacing: [8, 0, 4, 0],
  },
  title: { text: undefined },
  credits: { enabled: false },
  legend: { enabled: false },
  xAxis: {
    categories: [ 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    tickLength: 0,
    lineColor: 'rgba(148, 163, 184, 0.35)',
    labels: {
      style: {
        color: 'rgba(148, 163, 184, 0.9)',
        fontSize: '11px',
      },
    },
    crosshair: {
      color: 'rgba(56, 189, 248, 0.6)',
      width: 1,
      dashStyle: 'ShortDot',
    },
  },
  yAxis: {
    title: { text: undefined },
    gridLineColor: 'rgba(148, 163, 184, 0.12)',
    labels: {
      style: {
        color: 'rgba(148, 163, 184, 0.9)',
        fontSize: '11px',
      },
    },
  },
  tooltip: {
    shared: true,
    valueSuffix: ' проектов',
    backgroundColor: 'rgba(15, 23, 42, 0.97)',
    borderColor: 'rgba(56, 189, 248, 0.7)',
    borderRadius: 8,
    padding: 10,
    style: {
      color: '#e5e7eb',
      fontSize: '11px',
    },
  },
  plotOptions: {
    series: {
      animation: { duration: 600 },
      states: {
        inactive: { opacity: 0.25 },
      },
      marker: {
        enabled: false,
        symbol: 'circle',
        states: {
          hover: {
            enabled: true,
            radius: 4,
            fillColor: '#0f172a',
            lineColor: 'rgba(56, 189, 248, 1)',
            lineWidth: 2,
          },
        },
      },
    },
    areaspline: {
      fillOpacity: 1,
      lineWidth: 2,
    },
  },
  series: [
    {
      type: 'areaspline',
      name: 'Интеграции',
      data: [18, 24, 32, 37, 45, 52],
      color: 'rgba(56, 189, 248, 1)',
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, 'rgba(56, 189, 248, 0.35)'],
          [0.6, 'rgba(56, 189, 248, 0.05)'],
          [1, 'rgba(15, 23, 42, 0)'],
        ],
      },
    },
  ],
}

const reliabilityChartOptions: Options = {
  chart: {
    type: 'column',
    backgroundColor: 'transparent',
    spacing: [8, 0, 4, 0],
  },
  title: { text: undefined },
  credits: { enabled: false },
  legend: { enabled: false },
  xAxis: {
    categories: ['MTBF, часов', 'Срок службы, лет', 'Гарантия, лет'],
    lineColor: 'rgba(148, 163, 184, 0.35)',
    labels: {
      style: {
        color: 'rgba(148, 163, 184, 0.9)',
        fontSize: '10px',
      },
    },
  },
  yAxis: {
    title: { text: undefined },
    gridLineColor: 'rgba(148, 163, 184, 0.12)',
    labels: {
      style: {
        color: 'rgba(148, 163, 184, 0.9)',
        fontSize: '11px',
      },
    },
  },
  tooltip: {
    shared: true,
    backgroundColor: 'rgba(15, 23, 42, 0.97)',
    borderColor: 'rgba(56, 189, 248, 0.7)',
    borderRadius: 8,
    padding: 10,
    style: {
      color: '#e5e7eb',
      fontSize: '11px',
    },
  },
  plotOptions: {
    column: {
      borderRadius: 6,
      pointPadding: 0.12,
      borderWidth: 0,
      maxPointWidth: 56,
      dataLabels: {
        enabled: true,
        style: {
          color: '#0f172a',
          textOutline: 'none',
          fontSize: '10px',
          fontWeight: '600',
        },
      },
      states: {
        hover: {
          brightness: 0.06,
        },
      },
    },
    series: {
      animation: { duration: 500 },
    },
  },
  series: [
    {
      type: 'column',
      name: 'Показатель',
      data: [75000, 12, 5],
      color: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, 'rgba(56, 189, 248, 1)'],
          [1, 'rgba(37, 99, 235, 0.85)'],
        ],
      },
    },
  ],
}

export function HomePage() {
  return (
    <div className="space-y-10 md:space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-laser-blue/90 to-sky-700 px-6 py-9 text-white shadow-card md:px-10 md:py-12">
        {/* фон-сетка */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
        </div>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-stretch md:justify-between">
          {/* Левая часть */}
          <div className="flex flex-1 flex-col justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-slate-900/40 px-3 py-1 text-[11px] font-medium text-sky-100 shadow-sm backdrop-blur">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Поставки лазерных и оптоэлектронных компонентов</span>
                <span className="rounded-full bg-sky-500/15 px-2 text-[10px] uppercase tracking-wide">
                  b2b / b2g
                </span>
              </div>

              <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.6rem]">
                Каталог лазерных и оптоэлектронных&nbsp;компонентов с
                инженерной поддержкой
              </h1>

              <p className="max-w-xl text-sm text-sky-100/90 md:text-[15px]">
                Помогаем интеграторам, разработчикам и производителям
                собирать надёжные лазерные системы — от подбора компонентов
                и пресейла до внедрения и сопровождения.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-sky-900/40 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg"
              >
                Перейти к каталогу
                <span className="text-sky-500">↗</span>
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/5 px-4 py-2.5 text-sm text-sky-50 shadow-sm transition hover:bg-white/10"
              >
                Быстрый поиск по параметрам
              </Link>
              <span className="hidden text-[11px] text-sky-100/80 md:inline">
                • Без регистрации • Обновление позиций ежедневно
              </span>
            </div>

            <div className="grid gap-3 text-[11px] text-sky-100/85 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2.5 backdrop-blur">
                <div className="text-[10px] uppercase tracking-wide text-sky-200/80">
                  Поток проектов
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold">250+</span>
                  <span className="text-[11px] text-sky-100/70">
                    внедрений
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-sky-100/70">
                  промышленность и&nbsp;b2g по всей РФ
                </div>
              </div>
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-3 py-2.5 backdrop-blur">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wide">
                  <span className="text-emerald-100/90">Надёжность</span>
                  <span className="rounded-full bg-emerald-400/15 px-1.5 text-[9px] text-emerald-100">
                    SLA
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-emerald-200">
                    99.7%
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-emerald-50/80">
                  по сервисной статистике за 3 года
                </div>
              </div>
              <div className="rounded-xl border border-sky-400/25 bg-slate-900/40 px-3 py-2.5 backdrop-blur">
                <div className="text-[10px] uppercase tracking-wide text-sky-200/80">
                  Сроки и доступность
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold">3–6</span>
                  <span className="text-[11px] text-sky-100/70">
                    недель в среднем
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-sky-100/70">
                  стабильные каналы поставок и аналоги
                </div>
              </div>
            </div>
          </div>

          {/* Правая карточка с KPI / превью графиков */}
          <div className="flex w-full max-w-sm flex-col justify-between gap-4 rounded-2xl border border-sky-100/20 bg-slate-900/50 p-4 text-xs text-sky-100/90 shadow-xl backdrop-blur-md md:w-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-sky-200/80">
                  Панель интегратора
                </div>
                <div className="text-sm text-sky-100/90">
                  Сводка по проектам в&nbsp;реальном времени
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-3 py-1 text-[10px] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>

            <div className="grid gap-3 text-[11px]">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/70 p-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-sky-300/90">
                    Активные интеграции
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold">42</span>
                    <span className="text-[11px] text-sky-100/80">
                      проекта
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-200">
                  +8 за месяц
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-900/70 p-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-sky-300/90">
                    SLA поставки
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold">96%</span>
                    <span className="text-[11px] text-sky-100/80">
                      в срок
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-sky-500/15 px-2 py-1 text-[10px] font-medium text-sky-100">
                  соблюдение графика
                </span>
              </div>

              <div className="rounded-xl bg-slate-900/70 p-2.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-sky-300/90">
                    Быстрый доступ
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <Link
                    to="/catalog/kamery-mwir"
                    className="rounded-full bg-slate-800/90 px-2 py-1 text-sky-100/90 hover:bg-slate-700/90"
                  >
                    Камеры MWIR
                  </Link>
                  <Link
                    to="/catalog/lazernye-diodnye-moduli-s-volokonnym-vyhodom"
                    className="rounded-full bg-slate-800/90 px-2 py-1 text-sky-100/90 hover:bg-slate-700/90"
                  >
                    Лазерные диоды
                  </Link>
                  <Link
                    to="/catalog/optika"
                    className="rounded-full bg-slate-800/90 px-2 py-1 text-sky-100/90 hover:bg-slate-700/90"
                  >
                    Оптика и сканеры
                  </Link>
                  <Link
                    to="/catalog/optomehanika"
                    className="rounded-full bg-slate-800/90 px-2 py-1 text-sky-100/90 hover:bg-slate-700/90"
                  >
                    Оптомеханика
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ГРАФИКИ */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Динамика интеграций */}
        <div className="group rounded-2xl bg-white/95 p-5 shadow-card ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-sky-100/90">
          <div className="mb-3 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                Динамика интеграций
                <span className="rounded-full bg-emerald-50 px-1.5 text-[10px] font-medium text-emerald-700">
                  +38% за полгода
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Количество реализованных проектов за последние 6&nbsp;месяцев
              </div>
            </div>
            <div className="flex flex-col items-end text-[11px] text-emerald-700">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium">
                <span>▲</span>
                <span>устойчивый рост</span>
              </span>
              <span className="mt-0.5 text-[10px] text-slate-400">
                по данным CRM-системы
              </span>
            </div>
          </div>

          {/* контейнер под график */}
          <div className="relative mt-1 min-h-[220px] h-[220px] md:h-[260px]">
            <HighchartsReact
              highcharts={Highcharts}
              options={trafficChartOptions}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        </div>

        {/* Надёжность решений */}
        <div className="group rounded-2xl bg-white/95 p-5 shadow-card ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-sky-100/90">
          <div className="mb-3 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-900">
                Надёжность поставляемых решений
              </div>
              <div className="text-[11px] text-slate-500">
                Средние показатели по портфелю лазерных модулей
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px]">
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                Инженерный уровень
              </span>
              <span className="text-[10px] text-slate-400">
                данные верифицированы производителями
              </span>
            </div>
          </div>

          <div className="relative mt-1 min-h-[220px] h-[220px] md:h-[260px]">
            <HighchartsReact
              highcharts={Highcharts}
              options={reliabilityChartOptions}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        </div>
      </section>


      {/* КОМУ / ЗАЧЕМ / ПОЧЕМУ + CTA */}
      <section className="rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200 md:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Как мы работаем с заказчиками
            </div>
            <div className="text-sm text-slate-500">
              От первичного запроса до стабильно работающей системы.
            </div>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-800 transition hover:bg-slate-100"
          >
            Посмотреть формат работы
            <span>→</span>
          </Link>
        </div>

        <div className="mb-5 grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Для кого мы работаем
            </div>
            <p className="text-sm text-slate-700">
              Системные интеграторы, R&amp;D-отделы, производители
              высокотехнологичного оборудования и сервисные компании —
              мы говорим с вами на одном инженерном языке и понимаем
              ограничения по срокам, бюджету и рискам.
            </p>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Чем мы помогаем
            </div>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-slate-700">
              <li>Подбор компонентов под конкретные технические требования.</li>
              <li>
                Проработка альтернатив и снижение рисков по срокам и
                доступности позиций.
              </li>
              <li>
                Консультации по интеграции, тепловым режимам и эксплуатации
                решений.
              </li>
              <li>
                Сбор комплектов «под ключ» для пилотных и серийных проектов.
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Почему с нами удобно
            </div>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-slate-700">
              <li>Живой каталог с актуальными остатками и новинками.</li>
              <li>
                Инженерная поддержка на этапе пресейла, пилота и
                масштабирования.
              </li>
              <li>
                Прозрачные сроки поставки, сервис и сопровождение
                after-sales.
              </li>
              <li>
                Работаем по ТЗ, NDA и внутренним процедурам заказчика.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-[11px] text-slate-600 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="font-medium text-slate-800">
              1. Описываете задачу
            </div>
            <div>параметры из ТЗ, рабочие режимы, ограничения.</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="font-medium text-slate-800">
              2. Получаете подбор и аналитику
            </div>
            <div>несколько вариантов, риски, сроки и стоимость.</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="font-medium text-slate-800">
              3. Запускаете пилот или серию
            </div>
            <div>поставка, интеграция, техническое сопровождение.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
