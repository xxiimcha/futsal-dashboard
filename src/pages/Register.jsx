import { useState } from "react"
import { Link } from "react-router-dom"
import API_URL from "../config/api"

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFieldErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })

    setFieldErrors({
      ...fieldErrors,
      [name]: ""
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Registration failed")
        return
      }

      setMessage(data.message || "Account created successfully. Please verify your email.")
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
      setFieldErrors({})
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

          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Register a coach account
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

          <div>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                fieldErrors.fullName
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-green-500"
              }`}
              type="text"
              placeholder="Full name"
            />

            {fieldErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                fieldErrors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-green-500"
              }`}
              type="email"
              placeholder="Email address"
            />

            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                fieldErrors.password
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-green-500"
              }`}
              type="password"
              placeholder="Password"
            />

            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                fieldErrors.confirmPassword
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-green-500"
              }`}
              type="password"
              placeholder="Confirm password"
            />

            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
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