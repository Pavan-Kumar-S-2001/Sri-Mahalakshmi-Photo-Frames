import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiFetch } from '../../lib/apiClient'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
type Values = z.infer<typeof schema>

export function AdminLoginPage() {
  const nav = useNavigate()
  const qc = useQueryClient()
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <>
      <Helmet>
        <title>Owner Login — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
            Owner Admin Login
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            This area is private. Sign in to access orders and operations.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit(async (v) => {
              await apiFetch('/auth/admin/login', {
                method: 'POST',
                body: JSON.stringify(v),
              })
              await qc.invalidateQueries({ queryKey: ['auth', 'me'] })
              nav('/admin', { replace: true })
            })}
          >
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input
                className={inputCls(form.formState.errors.email)}
                {...form.register('email')}
              />
            </Field>
            <Field label="Password" error={form.formState.errors.password?.message}>
              <input
                type="password"
                className={inputCls(form.formState.errors.password)}
                {...form.register('password')}
              />
            </Field>
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Sign in
            </button>
          </form>
        </div>
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
  children: React.ReactNode
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

function inputCls(hasError: unknown) {
  return [
    'w-full rounded-2xl border bg-white px-3 py-3 text-sm text-zinc-950 outline-none',
    hasError
      ? 'border-red-300 focus:border-red-400'
      : 'border-zinc-200 focus:border-zinc-400',
  ].join(' ')
}

