import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API_URL from "../config/api"

export default function Login({ onLogin }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('${API_URL}/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("coach", JSON.stringify(data.coach))

      if (onLogin) {
        onLogin(data.coach)
      }

      navigate("/dashboard")
    } catch (err) {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-green-100">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-2xl font-bold text-white">
            FV
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Futsal VR Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Coach monitoring portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            type="email"
            placeholder="Email address"
          />

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            type="password"
            placeholder="Password"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/register" className="block text-center text-sm font-medium text-green-600">
            Create Coach Account
          </Link>
        </form>
      </div>
    </div>
  )
}