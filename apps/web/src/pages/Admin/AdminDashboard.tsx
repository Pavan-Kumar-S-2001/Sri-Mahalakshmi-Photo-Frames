import { Helmet } from 'react-helmet-async'

export function AdminDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Admin — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Admin auth + real metrics will be wired once the API is in place.
        </p>
      </div>
    </>
  )
}

