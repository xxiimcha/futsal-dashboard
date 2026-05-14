import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import API_URL from "../config/api"

export default function Progress({ onLogout }) {
  const [players, setPlayers] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/progress`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to fetch progress")
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
    fetchProgress()
  }, [])

  const getSkillProgress = (progress, skill) => {
    const skillRecords = progress.filter((item) => item.skill === skill)
    const completed = skillRecords.filter((item) => item.completed).length

    return {
      completed,
      percent: Math.round((completed / 4) * 100)
    }
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Progress Monitoring</h2>
        <p className="text-sm text-slate-500">
          Track each participant`s VR training completion
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading progress...</p>
      ) : (
        <section className="grid gap-4">
          {players.length === 0 ? (
            <div className="rounded-2xl border border-green-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
              No players found.
            </div>
          ) : (
            players.map((player) => (
              <div
                key={player.playerId}
                className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex justify-between">
                  <div>
                    <h3 className="font-semibold">{player.fullName}</h3>
                    <p className="text-sm text-slate-500">
                      {player.level} • {player.team || "No team"}
                    </p>
                  </div>

                  <p className="font-bold text-green-600">
                    {player.progressPercent}%
                  </p>
                </div>

                <div className="mb-5 h-3 rounded-full bg-green-100">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{ width: `${player.progressPercent}%` }}
                  ></div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {["Passing", "Dribbling", "Shooting"].map((skill) => {
                    const skillProgress = getSkillProgress(player.progress, skill)

                    return (
                      <div
                        key={skill}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-slate-700">{skill}</h4>
                          <span className="text-sm font-bold text-green-600">
                            {skillProgress.completed}/4
                          </span>
                        </div>

                        <div className="mb-3 h-2 rounded-full bg-green-100">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${skillProgress.percent}%` }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((stage) => {
                            const record = player.progress.find(
                              (item) => item.skill === skill && item.stage === stage
                            )

                            return (
                              <div
                                key={stage}
                                className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
                                  record?.completed
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-slate-500 border border-slate-200"
                                }`}
                              >
                                S{stage}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </Layout>
  )
}