import Layout from "../components/Layout"
import { players } from "../data/players"

export default function Players({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Players</h2>
        <p className="text-sm text-slate-500">List of registered futsal VR participants</p>
      </div>

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-500">
                <th className="py-3">Player ID</th>
                <th className="py-3">Name</th>
                <th className="py-3">Team</th>
                <th className="py-3">Level</th>
                <th className="py-3">Completed Drills</th>
                <th className="py-3">Score</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-slate-100 text-sm">
                  <td className="py-4 font-medium">{player.id}</td>
                  <td className="py-4">{player.name}</td>
                  <td className="py-4">{player.team}</td>
                  <td className="py-4">{player.level}</td>
                  <td className="py-4">{player.drills}</td>
                  <td className="py-4">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  )
}