import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/common/States'
import { postOrder, type OrderPayload } from '../lib/api'
import { useCartStore } from '../store/cartStore'

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')

  const total = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.qty,
    0,
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    const payload: OrderPayload = {
      customer: {
        full_name: fullName,
        company: company || undefined,
        email,
        phone,
        comment: comment || undefined,
      },
      items: items.map((i) => ({
        product_id: i.product.id,
        qty: i.qty,
      })),
    }

    try {
      await postOrder(payload)
      setSuccess('Заявка успешно отправлена. Наши менеджеры свяжутся с вами.')
      clear()
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      const subject = encodeURIComponent('Заявка с сайта Laserio')
      const bodyLines = [
        `ФИО: ${fullName}`,
        `Компания: ${company}`,
        `Email: ${email}`,
        `Телефон: ${phone}`,
        `Комментарий: ${comment}`,
        '',
        'Товары:',
        ...items.map(
          (i) =>
            `- ${i.product.name} (id: ${i.product.id}), количество: ${i.qty}`,
        ),
      ]
      const body = encodeURIComponent(bodyLines.join('\n'))
      window.location.href = `mailto:info@example.com?subject=${subject}&body=${body}`
      setSuccess(
        'Не удалось отправить заявку через API, но мы подготовили письмо в вашу почтовую программу. Вы также можете отправить его вручную.',
      )
      setError(
        err instanceof Error
          ? err.message
          : 'Ошибка при отправке заявки.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <ErrorState message="В заявке нет товаров. Добавьте позиции перед оформлением." />
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200"
      >
        <h1 className="text-2xl font-semibold text-slate-900">
          Оформление заявки
        </h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ФИО" required>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
            />
          </Field>
          <Field label="Компания">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
            />
          </Field>
          <Field label="Телефон" required>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Комментарий к заявке">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
          />
        </Field>

        {error && (
          <p className="text-xs text-rose-600">
            Ошибка отправки через API: {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-emerald-600">{success}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex rounded-full bg-laser-blue px-6 py-2 text-sm font-semibold text-sky-50 hover:bg-laser-blue-light disabled:opacity-60"
        >
          {submitting ? 'Отправляем...' : 'Отправить заявку'}
        </button>
      </form>

      <aside className="space-y-4 rounded-2xl bg-white/95 p-6 shadow-card ring-1 ring-slate-200">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">
          Состав заявки
        </h2>
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1 text-xs">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-none"
            >
              <div>
                <div className="mb-1 font-medium text-slate-800">
                  {item.product.name}
                </div>
                <div className="text-slate-500">
                  Количество: {item.qty}
                </div>
              </div>
              <div className="text-right text-slate-600">
                {item.product.price
                  ? `${(item.product.price * item.qty).toLocaleString(
                      'ru-RU',
                    )} ₽`
                  : 'по запросу'}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-3 text-sm text-slate-700">
          Итого:{' '}
          <span className="font-semibold text-laser-blue">
            {total === 0
              ? 'по запросу'
              : `${total.toLocaleString('ru-RU')} ₽`}
          </span>
        </div>
      </aside>
    </div>
  )
}

type FieldProps = {
  label: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, required, children }: FieldProps) {
  return (
    <label className="block text-xs text-slate-600">
      <span className="mb-1 inline-block">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}


