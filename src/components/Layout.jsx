import { Link, useLocation } from "react-router-dom"

export default function Layout({ children, onLogout }) {
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Players", path: "/players" },
    { name: "Progress", path: "/progress" }
  ]

  return (
    <div className="min-h-screen bg-green-50 text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-green-100 bg-white">
          <div className="flex items-center gap-3 border-b border-green-100 px-6 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-lg font-bold text-white">
              FV
            </div>
            <div>
              <h1 className="text-lg font-semibold">Futsal VR</h1>
              <p className="text-sm text-slate-500">Monitoring Panel</p>
            </div>
          </div>

          <nav className="space-y-2 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-xl px-4 py-3 font-medium ${
                  location.pathname === item.path
                    ? "bg-green-500 text-white"
                    : "text-slate-600 hover:bg-green-50"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <button
              onClick={onLogout}
              className="w-full rounded-xl px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}