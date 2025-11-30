export function ContactsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">
          Контакты
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          По всем вопросам поставки, технического подбора и сопровождения
          оборудования вы можете связаться с нами любым удобным способом.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Адрес
            </h2>
            <p className="text-slate-800">
              г. Москва, м. Чистые пруды
              <br />
              Лучевой переулок, д. 7, офис 12
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Телефоны
            </h2>
            <div className="space-y-1 text-slate-800">
              <p>
                Отдел продаж:{' '}
                <a
                  href="tel:+74951234567"
                  className="text-laser-accent hover:text-sky-700"
                >
                  +7 (495) 123‑45‑67
                </a>
              </p>
              <p>
                Техническая поддержка:{' '}
                <a
                  href="tel:+74959876543"
                  className="text-laser-accent hover:text-sky-700"
                >
                  +7 (495) 987‑65‑43
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email и время работы
            </h2>
            <p className="text-slate-800">
              Электронная почта:{' '}
              <a
                href="mailto:info@test.ru"
                className="text-laser-accent hover:text-sky-700"
              >
                info@test.ru
              </a>
            </p>
            <p className="text-slate-800">
              Время работы:
              <br />
              Пн–Пт: 9:00 – 18:00
              <br />
              Сб–Вс: по предварительной договорённости
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Мы на карте
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <iframe
            title="Карта офиса Laserio Components"
            src="https://yandex.ru/map-widget/v1/?ll=37.6449%2C55.7638&z=16&l=map&pt=37.6449%2C55.7638~pm2rdm"
            width="100%"
            height="360"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  )
}


