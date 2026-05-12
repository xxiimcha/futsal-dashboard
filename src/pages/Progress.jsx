import Layout from "../components/Layout"
import { players } from "../data/players"

export default function Progress({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Progress Monitoring</h2>
        <p className="text-sm text-slate-500">Track each participant's VR training completion</p>
      </div>

      <section className="grid gap-4">
        {players.map((player) => (
          <div key={player.id} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-between">
              <div>
                <h3 className="font-semibold">{player.name}</h3>
                <p className="text-sm text-slate-500">{player.level} • {player.team}</p>
              </div>

              <p className="font-bold text-green-600">{player.progress}%</p>
            </div>

            <div className="h-3 rounded-full bg-green-100">
              <div className="h-3 rounded-full bg-green-500" style={{ width: `${player.progress}%` }}></div>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  )
}