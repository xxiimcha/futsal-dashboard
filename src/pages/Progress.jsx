import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
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

  const exportToExcel = () => {
    if (players.length === 0) {
      setError("No data available to export")
      return
    }

    const exportDate = new Date().toISOString().split("T")[0]
    const rows = []

    players.forEach((player) => {
      const totalStages = 12
      const completedStages = player.progress.filter(
        (item) => item.completed
      ).length

      ;["Passing", "Dribbling", "Shooting"].forEach((skill) => {
        const skillRecords = player.progress.filter(
          (item) => item.skill === skill
        )

        const completedSkillStages = skillRecords.filter(
          (item) => item.completed
        ).length

        const skillProgressPercent = Math.round(
          (completedSkillStages / 4) * 100
        )

        ;[1, 2, 3, 4].forEach((stage) => {
          const record = player.progress.find(
            (item) => item.skill === skill && item.stage === stage
          )

          rows.push({
            ExportDate: exportDate,
            PlayerID: player.playerId,
            PlayerName: player.fullName,
            Level: player.level || "",
            Team: player.team || "",
            Skill: skill,
            Stage: stage,
            StageLabel: `${skill} Stage ${stage}`,
            Score: record?.score ?? 0,
            CompletedFlag: record?.completed ? 1 : 0,
            CompletionStatus: record?.completed ? "Completed" : "Not Completed",
            SkillCompletedStages: completedSkillStages,
            SkillTotalStages: 4,
            SkillProgressPercent: skillProgressPercent,
            PlayerCompletedStages: completedStages,
            PlayerTotalStages: totalStages,
            PlayerProgressPercent: player.progressPercent ?? 0
          })
        })
      })
    })

    const summaryRows = players.map((player) => {
      const passing = getSkillProgress(player.progress, "Passing")
      const dribbling = getSkillProgress(player.progress, "Dribbling")
      const shooting = getSkillProgress(player.progress, "Shooting")

      return {
        PlayerID: player.playerId,
        PlayerName: player.fullName,
        Level: player.level || "",
        Team: player.team || "",
        PassingCompleted: passing.completed,
        PassingPercent: passing.percent,
        DribblingCompleted: dribbling.completed,
        DribblingPercent: dribbling.percent,
        ShootingCompleted: shooting.completed,
        ShootingPercent: shooting.percent,
        OverallProgressPercent: player.progressPercent ?? 0
      }
    })

    const workbook = XLSX.utils.book_new()

    const progressSheet = XLSX.utils.json_to_sheet(rows)
    const summarySheet = XLSX.utils.json_to_sheet(summaryRows)

    progressSheet["!cols"] = [
      { wch: 14 },
      { wch: 26 },
      { wch: 24 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 10 },
      { wch: 22 },
      { wch: 10 },
      { wch: 16 },
      { wch: 20 },
      { wch: 22 },
      { wch: 18 },
      { wch: 22 },
      { wch: 24 },
      { wch: 18 },
      { wch: 24 }
    ]

    summarySheet["!cols"] = [
      { wch: 26 },
      { wch: 24 },
      { wch: 14 },
      { wch: 16 },
      { wch: 18 },
      { wch: 16 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
      { wch: 24 }
    ]

    progressSheet["!autofilter"] = {
      ref: XLSX.utils.encode_range(
        XLSX.utils.decode_range(progressSheet["!ref"])
      )
    }

    summarySheet["!autofilter"] = {
      ref: XLSX.utils.encode_range(
        XLSX.utils.decode_range(summarySheet["!ref"])
      )
    }

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
    XLSX.utils.book_append_sheet(workbook, progressSheet, "Progress Data")

    XLSX.writeFile(workbook, `vr_progress_analysis_${exportDate}.xlsx`)
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Monitoring</h2>
          <p className="text-sm text-slate-500">
            Track each participant's VR training completion
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Export Excel
        </button>
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
                          <h4 className="font-semibold text-slate-700">
                            {skill}
                          </h4>

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
                              (item) =>
                                item.skill === skill && item.stage === stage
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