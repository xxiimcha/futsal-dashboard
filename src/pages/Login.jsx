import { Link } from "react-router-dom"

export default function Login({ onLogin }) {
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

        <div className="space-y-4">
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" type="email" placeholder="Email address" />
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500" type="password" placeholder="Password" />

          <button onClick={onLogin} className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600">
            Login
          </button>

          <Link to="/register" className="block text-center text-sm font-medium text-green-600">
            Create Coach Account
          </Link>
        </div>
      </div>
    </div>
  )
}