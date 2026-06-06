import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import API_URL from "../config/api"

const skills = ["Passing", "Dribbling", "Shooting"]

function StatCard({ label, value, subtext, highlight }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className={`mt-2 text-3xl font-bold ${highlight ? "text-green-600" : "text-slate-800"}`}>
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-400">{subtext}</p>
    </div>
  )
}

function SimpleBarChart({ title, subtitle, data, maxValue, valueKey, labelKey, suffix = "" }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-sm text-slate-500">
            No data available.
          </div>
        ) : (
          data.map((item) => {
            const value = item[valueKey] || 0
            const percent = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0

            return (
              <div key={item[labelKey]}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="max-w-[70%] truncate font-medium text-slate-700">
                    {item[labelKey]}
                  </span>
                  <span className="font-bold text-green-600">
                    {value}
                    {suffix}
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-green-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function StackedSkillChart({ data }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-slate-800">Skill Completion Overview</h3>
        <p className="text-sm text-slate-500">Completed and remaining stages per skill</p>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const total = item.completed + item.remaining
          const completedPercent = total > 0 ? (item.completed / total) * 100 : 0
          const remainingPercent = total > 0 ? (item.remaining / total) * 100 : 0

          return (
            <div key={item.skill}>
              <div className="mb-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-700">{item.skill}</p>
                  <p className="text-xs text-slate-500">
                    {item.completed} completed, {item.remaining} remaining
                  </p>
                </div>

                <span className="font-bold text-green-600">{item.progress}%</span>
              </div>

              <div className="flex h-5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="bg-green-500"
                  style={{ width: `${completedPercent}%` }}
                ></div>
                <div
                  className="bg-green-100"
                  style={{ width: `${remainingPercent}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
          Completed
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-100"></span>
          Remaining
        </div>
      </div>
    </div>
  )
}

function DonutChart({ completed, total }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-slate-800">Overall Completion</h3>
        <p className="text-sm text-slate-500">Completed versus remaining required stages</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative h-48 w-48">
          <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#dcfce7"
              strokeWidth="18"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-green-600">{percent}%</p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-3">
          <div className="rounded-xl bg-green-50 p-3 text-center">
            <p className="text-xs text-slate-500">Completed</p>
            <p className="font-bold text-green-700">{completed}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="font-bold text-slate-700">{Math.max(total - completed, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LineChart({ title, subtitle, data, labelKey, valueKey }) {
  const width = 500
  const height = 260
  const padding = 40
  const maxValue = Math.max(...data.map((item) => item[valueKey]), 10)

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (data.length - 1)

    const y =
      height - padding - ((item[valueKey] || 0) / maxValue) * (height - padding * 2)

    return {
      ...item,
      x,
      y
    }
  })

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-72 min-w-[500px]">
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {[0, 25, 50, 75, 100].map((tick) => {
            const y = height - padding - (tick / 100) * (height - padding * 2)

            return (
              <g key={tick}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text x={padding - 12} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">
                  {tick}
                </text>
              </g>
            )
          })}

          <path d={path} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />

          {points.map((point) => (
            <g key={point[labelKey]}>
              <circle cx={point.x} cy={point.y} r="6" fill="#22c55e" />
              <text x={point.x} y={point.y - 12} textAnchor="middle" fontSize="12" fill="#166534">
                {point[valueKey]}
              </text>
              <text x={point.x} y={height - 12} textAnchor="middle" fontSize="12" fill="#64748b">
                {point[labelKey]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

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
      ? Math.round(
          players.reduce((sum, player) => sum + (player.progressPercent || 0), 0) /
            totalPlayers
        )
      : 0

  const allProgressRecords = players.flatMap((player) => player.progress || [])

  const averageScore =
    allProgressRecords.length > 0
      ? Math.round(
          allProgressRecords.reduce((sum, record) => sum + (record.score || 0), 0) /
            allProgressRecords.length
        )
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
    .sort((a, b) => (b.progressPercent || 0) - (a.progressPercent || 0))
    .slice(0, 5)

  const skillChartData = skills.map((skill) => {
    const stats = getSkillStats(skill)

    return {
      skill,
      completed: stats.completed,
      remaining: Math.max(stats.total - stats.completed, 0),
      progress: stats.percent
    }
  })

  const playerProgressChartData = topPlayers.map((player) => ({
    name: player.fullName,
    progress: player.progressPercent || 0,
    score:
      player.progress && player.progress.length > 0
        ? Math.round(
            player.progress.reduce((sum, record) => sum + (record.score || 0), 0) /
              player.progress.length
          )
        : 0
  }))

  const scoreBySkillData = skills.map((skill) => {
    const records = allProgressRecords.filter((record) => record.skill === skill)

    return {
      skill,
      score:
        records.length > 0
          ? Math.round(
              records.reduce((sum, record) => sum + (record.score || 0), 0) /
                records.length
            )
          : 0
    }
  })

  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Coach Dashboard</h2>
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
            <StatCard
              label="Total Players"
              value={totalPlayers}
              subtext="Registered under your coach account"
            />

            <StatCard
              label="Average Progress"
              value={`${averageProgress}%`}
              subtext="Overall player completion average"
              highlight
            />

            <StatCard
              label="Average Score"
              value={averageScore}
              subtext="Based on recorded skill stages"
            />

            <StatCard
              label="Completion Rate"
              value={`${completionRate}%`}
              subtext={`${completedStages} of ${totalStages} stages completed`}
              highlight
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <StackedSkillChart data={skillChartData} />

            <DonutChart completed={completedStages} total={totalStages} />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <SimpleBarChart
              title="Top Player Progress"
              subtitle="Highest progress percentage among players"
              data={playerProgressChartData}
              maxValue={100}
              valueKey="progress"
              labelKey="name"
              suffix="%"
            />

            <LineChart
              title="Average Score by Skill"
              subtitle="Average recorded score for each simulation module"
              data={scoreBySkillData}
              labelKey="skill"
              valueKey="score"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {skills.map((skill) => {
              const stats = getSkillStats(skill)

              return (
                <div
                  key={skill}
                  className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{skill}</h3>
                      <p className="text-sm text-slate-500">
                        4-stage skill simulation
                      </p>
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
              <h3 className="mb-4 font-semibold text-slate-800">
                Top Player Progress List
              </h3>

              {topPlayers.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No player progress available.
                </p>
              ) : (
                <div className="space-y-4">
                  {topPlayers.map((player) => (
                    <div key={player.playerId}>
                      <div className="mb-2 flex justify-between text-sm">
                        <div>
                          <p className="font-medium text-slate-800">
                            {player.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {player.team || "No team"}
                          </p>
                        </div>

                        <span className="font-bold text-green-600">
                          {player.progressPercent || 0}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-green-100">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${player.progressPercent || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-slate-800">
                Training Summary
              </h3>

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
                  <p className="text-sm text-slate-500">
                    Total Required Stages per Player
                  </p>
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