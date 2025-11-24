import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/common/States'
import { postOrder, type OrderPayload } from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const showToast = useToastStore((s) => s.showToast)

  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)

    const payload: OrderPayload = {
      customer: {
        full_name: fullName,
        company: company || undefined,
        email,
        phone,
        comment: comment || undefined,
      },
      // Плоские поля для прямого маппинга на таблицу orders
      customer_name: fullName,
      email,
      phone,
      comment: comment || undefined,
      address: address || undefined,
      items: items.map((i) => ({
        product_id: i.product.id,
        qty: i.qty,
      })),
      shipped_items: items.map((i) => i.product.id),
    }

    try {
      await postOrder(payload)
      clear()
      showToast(
        'success',
        'Заявка успешно отправлена. Наши менеджеры свяжутся с вами.',
      )
      navigate('/')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ошибка при отправке заявки.',
      )
      showToast(
        'error',
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

        <Field label="Адрес">
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
          />
        </Field>

        <Field label="Комментарий к заявке">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-laser-accent focus:outline-none"
          />
        </Field>

        {error && (
          <p className="text-xs text-rose-600">Ошибка: {error}</p>
        )}
        {/* Текстовое сообщение об успехе не показываем, за это отвечает toast */}

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
              <div className="text-right text-slate-600" />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
          Итоговая стоимость будет рассчитана менеджером после обработки заявки.
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


