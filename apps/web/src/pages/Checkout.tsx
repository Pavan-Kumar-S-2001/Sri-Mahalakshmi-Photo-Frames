import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
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

export function CheckoutPage() {
const nav = useNavigate()
const [paymentMode, setPaymentMode] = useState<'full' | 'advance'>('full')
const [loading, setLoading] = useState(false) // ✅ FIX

const advancePercent = 30
const cartTotals = useCartStore((s) => s.totals())
const cartItems = useCartStore((s) => s.items)
const clearCart = useCartStore((s) => s.clear)

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

const totals = useMemo(() => {
const total = cartTotals.totalPaise
const payable =
paymentMode === 'full'
? total
: Math.round((total * advancePercent) / 100)
return { total, payable }
}, [advancePercent, cartTotals.totalPaise, paymentMode])

return (
<> <Helmet> <title>Checkout — Sri Mahalakshmi Photo Frames</title> </Helmet>

```
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
          const { order } = await apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify({
              customer: values,
              paymentMode,
              advancePercent,
              items: cartItems.map((i) => ({
                productId: i.productId,
                qty: i.qty,
                customization: i.customization,
              })),
            }),
          }) as { order: { id: string } }

          const rp = await apiFetch('/payments/razorpay/order', {
            method: 'POST',
            body: JSON.stringify({ orderId: order.id }),
          }) as { keyId: string; amountPaise: number; currency: string; razorpayOrderId: string }

          const Razorpay = await loadRazorpayCheckout()

          const instance = new Razorpay({
            key: rp.keyId,
            amount: rp.amountPaise,
            currency: rp.currency,
            name: 'Sri Mahalakshmi Photo Frames',
            description: 'Custom photo frame order',
            order_id: rp.razorpayOrderId,

            handler: () => {
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
        } catch (err) {
          alert('Payment failed. Try again.')
        } finally {
          setLoading(false) // ✅ FIX
        }
      })}
    >
      {/* LEFT */}
      <section className="lg:col-span-7">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="text-sm font-semibold text-zinc-950">
            Delivery address
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <input className={inputCls(form.formState.errors.fullName)} {...form.register('fullName')} />
            </Field>

            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <input className={inputCls(form.formState.errors.phone)} {...form.register('phone')} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Address" error={form.formState.errors.addressLine1?.message}>
                <input className={inputCls(form.formState.errors.addressLine1)} {...form.register('addressLine1')} />
              </Field>
            </div>

            <Field label="City" error={form.formState.errors.city?.message}>
              <input className={inputCls(form.formState.errors.city)} {...form.register('city')} />
            </Field>

            <Field label="Pincode" error={form.formState.errors.pincode?.message}>
              <input className={inputCls(form.formState.errors.pincode)} {...form.register('pincode')} />
            </Field>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="text-sm font-semibold text-zinc-950">Payment</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PaymentChoice
              title="Full payment"
              desc="Pay the complete amount now."
              selected={paymentMode === 'full'}
              onClick={() => setPaymentMode('full')}
            />

            <PaymentChoice
              title={`Advance (${advancePercent}%)`}
              desc="Pay part now, rest on delivery."
              selected={paymentMode === 'advance'}
              onClick={() => setPaymentMode('advance')}
            />
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Secure payment powered by Razorpay.
          </p>
        </div>
      </section>

      {/* RIGHT */}
      <aside className="lg:col-span-5">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-zinc-950">
            Order summary
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(cartTotals.subtotalPaise)} />
            <Row label="Delivery" value={formatINR(cartTotals.deliveryFeePaise)} />
            <div className="my-3 h-px bg-zinc-200" />
            <Row label="Total" value={formatINR(totals.total)} bold />
            <Row label="Payable now" value={formatINR(totals.payable)} bold />
          </div>

          <button
            type="submit"
            disabled={cartItems.length === 0 || loading}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </div>
      </aside>
    </form>
  </div>
</>

    )

function Field({ label, error, children }: any) {
return ( <label className="block"> <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div> <div className="mt-2">{children}</div>
{error && <div className="mt-1 text-xs text-red-600">{error}</div>} </label>
)
}

function inputCls(hasError: any) {
return [
'w-full rounded-2xl border bg-white px-3 py-3 text-sm text-zinc-950 outline-none',
hasError ? 'border-red-300' : 'border-zinc-200',
].join(' ')
}

function Row({ label, value, bold }: any) {
return ( <div className="flex items-center justify-between">
<div className={bold ? 'font-semibold' : 'text-zinc-600'}>{label}</div>
<div className={bold ? 'font-semibold' : ''}>{value}</div> </div>
)
}

function PaymentChoice({ title, desc, selected, onClick }: any) {
return (
<button
type="button"
onClick={onClick}
className={`rounded-2xl border p-4 text-left ${
        selected ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white text-white' : 'bg-white'
      }`}
> <div className="text-sm font-semibold">{title}</div> <div className="text-xs mt-1">{desc}</div> </button>
)
} }
