import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AdminLoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
  if (email === 'admin@gmail.com' && password === 'admin123') {

    localStorage.setItem('isAdmin', 'true')

    alert('Login success')
    navigate('/admin')

  } else {
    alert('Wrong email or password')
  }
}

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-50">
      <div className="bg-white p-8 rounded-3xl shadow w-[350px]">

        <h2 className="text-xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white font-semibold"
        >
          Login
        </button>

      </div>
    </div>
  )
}