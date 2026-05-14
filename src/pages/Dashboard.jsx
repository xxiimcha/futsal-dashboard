import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import API_URL from "../config/api"

export default function Dashboard({ onLogout }) {
  const [players, setPlayers] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/progress`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to fetch dashboard data")
        return
      }

      setPlayers(data)
    } catch (err) {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalPlayers = players.length

  const averageProgress =
    totalPlayers > 0
      ? Math.round(players.reduce((sum, player) => sum + player.progressPercent, 0) / totalPlayers)
      : 0

  const allProgressRecords = players.flatMap((player) => player.progress || [])

  const averageScore =
    allProgressRecords.length > 0
      ? Math.round(allProgressRecords.reduce((sum, record) => sum + record.score, 0) / allProgressRecords.length)
      : 0

  const completedStages = allProgressRecords.filter((record) => record.completed).length
  const totalStages = totalPlayers * 12

  const completionRate =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0

  const getSkillStats = (skill) => {
    const records = allProgressRecords.filter((record) => record.skill === skill)
    const completed = records.filter((record) => record.completed).length
    const total = totalPlayers * 4

    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const topPlayers = [...players]
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .slice(0, 5)

  const skills = ["Passing", "Dribbling", "Shooting"]

  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Coach Dashboard</h2>
        <p className="text-sm text-slate-500">
          Monitor player performance from the VR futsal training app
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Players</p>
              <h3 className="mt-2 text-3xl font-bold">{totalPlayers}</h3>
              <p className="mt-2 text-xs text-slate-400">Registered under your coach account</p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Average Progress</p>
              <h3 className="mt-2 text-3xl font-bold text-green-600">{averageProgress}%</h3>
              <p className="mt-2 text-xs text-slate-400">Overall player completion average</p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Average Score</p>
              <h3 className="mt-2 text-3xl font-bold">{averageScore}</h3>
              <p className="mt-2 text-xs text-slate-400">Based on recorded skill stages</p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completion Rate</p>
              <h3 className="mt-2 text-3xl font-bold text-green-600">{completionRate}%</h3>
              <p className="mt-2 text-xs text-slate-400">
                {completedStages} of {totalStages} stages completed
              </p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {skills.map((skill) => {
              const stats = getSkillStats(skill)

              return (
                <div key={skill} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{skill}</h3>
                      <p className="text-sm text-slate-500">4-stage skill simulation</p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                      {stats.percent}%
                    </span>
                  </div>

                  <div className="mb-3 h-3 rounded-full bg-green-100">
                    <div
                      className="h-3 rounded-full bg-green-500"
                      style={{ width: `${stats.percent}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-slate-500">
                    {stats.completed} of {stats.total} stages completed
                  </p>
                </div>
              )
            })}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold">Top Player Progress</h3>

              {topPlayers.length === 0 ? (
                <p className="text-sm text-slate-500">No player progress available.</p>
              ) : (
                <div className="space-y-4">
                  {topPlayers.map((player) => (
                    <div key={player.playerId}>
                      <div className="mb-2 flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{player.fullName}</p>
                          <p className="text-xs text-slate-500">{player.team || "No team"}</p>
                        </div>

                        <span className="font-bold text-green-600">
                          {player.progressPercent}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-green-100">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${player.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold">Training Summary</h3>

              <div className="space-y-4">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-slate-500">Training Skills</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Passing, Dribbling, and Shooting
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-slate-500">Stages per Skill</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    4 stages per simulation module
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-slate-500">Total Required Stages per Player</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    12 total stages
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  )
}