import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import API_URL from "../config/api"

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
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
    setMessage("")
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to reset password")
        return
      }

      setMessage(data.message || "Password has been reset successfully")

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (err) {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-2xl font-bold text-white">
            FV
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a new password for your coach account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <p className="rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            type="password"
            placeholder="New password"
            required
          />

          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            type="password"
            placeholder="Confirm new password"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm font-medium text-green-600"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  )
}