import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API_URL from "../config/api"

export default function VerifyEmail() {
  const { token } = useParams()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/verify-email/${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.message || "Email verification failed")
          return
        }

        setMessage(data.message || "Email verified successfully")
      } catch (err) {
        setError("Cannot connect to server")
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-2xl font-bold text-white">
          FV
        </div>

        <h1 className="text-2xl font-bold text-slate-800">
          Email Verification
        </h1>

        {loading && (
          <p className="mt-4 text-sm text-slate-500">
            Verifying your email...
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && (
          <Link
            to="/login"
            className="mt-6 block rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  )
}