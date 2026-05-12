import Layout from "../components/Layout"
import { players } from "../data/players"

export default function Dashboard({ onLogout }) {
  const totalPlayers = players.length
  const averageProgress = Math.round(players.reduce((sum, player) => sum + player.progress, 0) / players.length)
  const averageScore = Math.round(players.reduce((sum, player) => sum + player.score, 0) / players.length)

  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Coach Dashboard</h2>
        <p className="text-sm text-slate-500">Monitor player performance from the VR futsal training app</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Players</p>
          <h3 className="mt-2 text-3xl font-bold">{totalPlayers}</h3>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Progress</p>
          <h3 className="mt-2 text-3xl font-bold">{averageProgress}%</h3>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Score</p>
          <h3 className="mt-2 text-3xl font-bold">{averageScore}</h3>
        </div>
      </section>
    </Layout>
  )
}