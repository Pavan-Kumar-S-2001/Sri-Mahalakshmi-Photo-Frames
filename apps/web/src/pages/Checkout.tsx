import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { formatINR } from '../lib/money'
import { apiFetch } from '../lib/apiClient'
import { loadRazorpayCheckout } from '../lib/razorpay'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your name'),
  phone: z.string().min(10, 'Enter a phone number'),
  addressLine1: z.string().min(5, 'Enter address'),
  city: z.string().min(2, 'Enter city'),
  pincode: z.string().min(6, 'Enter pincode'),
})

type FormValues = z.infer<typeof schema>

type CreatedOrder = {
  id: string
  totalPaise: number
  payableNowPaise: number
  advancePaidPaise: number
}

export function CheckoutPage() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const totalsFn = useCartStore((state) => state.totals)
  const totals = totalsFn()
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clear)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      city: '',
      pincode: '',
    },
  })

  return (
    <>
      <Helmet>
        <title>Checkout - Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Checkout
        </h1>

        <form
          className="mt-6 grid gap-6 lg:grid-cols-12"
          onSubmit={form.handleSubmit(async (values) => {
            if (cartItems.length === 0) return

            setLoading(true)

            try {
              const { order } = await apiFetch<{ order: CreatedOrder }>('/orders', {
                method: 'POST',
                body: JSON.stringify({
                  customer: values,
                  items: cartItems.map((item) => ({
                    productId: item.productId,
                    qty: item.qty,
                    customization: item.customization,
                  })),
                }),
              })

              const rp = await apiFetch<{
                keyId: string
                amountPaise: number
                currency: string
                razorpayOrderId: string
              }>('/payments/razorpay/order', {
                method: 'POST',
                body: JSON.stringify({ orderId: order.id }),
              })

              const Razorpay = await loadRazorpayCheckout()

              const instance = new Razorpay({
                key: rp.keyId,
                amount: rp.amountPaise,
                currency: rp.currency,
                name: 'Sri Mahalakshmi Photo Frames',
                description: 'Advance payment for custom frame order',
                order_id: rp.razorpayOrderId,
                handler: async (response: any) => {
                  await apiFetch('/payments/razorpay/confirm', {
                    method: 'POST',
                    body: JSON.stringify({
                      orderId: order.id,
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                    }),
                  })

                  clearCart()
                  nav(`/order/confirmation?orderId=${order.id}`)
                },
                prefill: {
                  name: values.fullName,
                  contact: values.phone,
                },
                theme: { color: '#18181b' },
              })

              instance.open()
            } catch (error: any) {
              alert('Payment failed. Please try again.')
            } finally {
              setLoading(false)
            }
          })}
        >
          <section className="lg:col-span-7">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-950">
                Delivery address
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={form.formState.errors.fullName?.message}>
                  <input className={inputCls(Boolean(form.formState.errors.fullName))} {...form.register('fullName')} />
                </Field>

                <Field label="Phone" error={form.formState.errors.phone?.message}>
                  <input className={inputCls(Boolean(form.formState.errors.phone))} {...form.register('phone')} />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Address" error={form.formState.errors.addressLine1?.message}>
                    <input className={inputCls(Boolean(form.formState.errors.addressLine1))} {...form.register('addressLine1')} />
                  </Field>
                </div>

                <Field label="City" error={form.formState.errors.city?.message}>
                  <input className={inputCls(Boolean(form.formState.errors.city))} {...form.register('city')} />
                </Field>

                <Field label="Pincode" error={form.formState.errors.pincode?.message}>
                  <input className={inputCls(Boolean(form.formState.errors.pincode))} {...form.register('pincode')} />
                </Field>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-950">Advance payment</div>
              <p className="mt-3 text-sm text-zinc-600">
                Customers must pay the product advance online while placing the order.
                The remaining balance is paid after delivery confirmation.
              </p>
              <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm">
                <Row label="Advance to pay now" value={formatINR(totals.advancePayablePaise)} bold />
                <Row label="Balance after delivery" value={formatINR(totals.remainingDuePaise)} />
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-950">
                Order summary
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatINR(totals.subtotalPaise)} />
                <Row label="Delivery" value={formatINR(totals.deliveryFeePaise)} />
                <div className="my-3 h-px bg-zinc-200" />
                <Row label="Total" value={formatINR(totals.totalPaise)} bold />
                <Row label="Advance to pay now" value={formatINR(totals.advancePayablePaise)} bold />
                <Row label="Balance after delivery" value={formatINR(totals.remainingDuePaise)} />
              </div>

              <div className="mt-4 text-xs text-zinc-500">
                Local delivery is handled for nearby orders. Minimum order value is Rs. 500.
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0 || loading}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay advance with Razorpay'}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2">{children}</div>
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  )
}

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-2xl border bg-white px-3 py-3 text-sm text-zinc-950 outline-none',
    hasError ? 'border-red-300' : 'border-zinc-200',
  ].join(' ')
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className={bold ? 'font-semibold text-zinc-950' : 'text-zinc-600'}>{label}</div>
      <div className={bold ? 'font-semibold text-zinc-950' : 'text-zinc-950'}>{value}</div>
    </div>
  )
}
