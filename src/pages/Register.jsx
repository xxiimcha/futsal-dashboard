import { Link } from "react-router-dom"

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-green-100">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-2xl font-bold text-white">
            FV
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">Register a coach account</p>
        </div>

        <div className="space-y-4">
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" type="text" placeholder="Full name" />
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" type="email" placeholder="Email address" />
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" type="password" placeholder="Password" />

          <button className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600">
            Register
          </button>

          <Link to="/login" className="block text-center text-sm font-medium text-green-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}