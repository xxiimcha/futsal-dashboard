import { useEffect, useState } from "react"
import Layout from "../components/Layout"

const initialFormData = {
  studentId: "",
  fullName: "",
  team: "",
  level: "Beginner",
  completedDrills: 0,
  score: 0
}

const initialConfirmModal = {
  show: false,
  title: "",
  message: "",
  type: "default",
  confirmText: "Confirm",
  onConfirm: null
}

export default function Players({ onLogout }) {
  const [players, setPlayers] = useState([])
  const [formData, setFormData] = useState(initialFormData)
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(initialConfirmModal)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/players", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to fetch players")
        return
      }

      setPlayers(data)
    } catch (err) {
      setError("Cannot connect to server")
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name === "completedDrills" || name === "score" ? Number(value) : value
    })
  }

  const openConfirmModal = ({ title, message, type = "default", confirmText = "Confirm", onConfirm }) => {
    setConfirmModal({
      show: true,
      title,
      message,
      type,
      confirmText,
      onConfirm
    })
  }

  const closeConfirmModal = () => {
    setConfirmModal(initialConfirmModal)
  }

  const openAddModal = () => {
    setFormData(initialFormData)
    setEditingId(null)
    setError("")
    setShowModal(true)
  }

  const openEditModal = (player) => {
    setEditingId(player._id)
    setFormData({
      studentId: player.studentId,
      fullName: player.fullName,
      team: player.team || "",
      level: player.level || "Beginner",
      completedDrills: player.completedDrills || 0,
      score: player.score || 0
    })
    setError("")
    setShowModal(true)
  }

  const closeModal = () => {
    openConfirmModal({
      title: "Close Form",
      message: "Unsaved changes will be lost. Do you want to close this form?",
      type: "warning",
      confirmText: "Close",
      onConfirm: () => {
        setShowModal(false)
        setEditingId(null)
        setFormData(initialFormData)
        setError("")
        closeConfirmModal()
      }
    })
  }

  const savePlayer = async () => {
    closeConfirmModal()
    setLoading(true)
    setError("")

    const url = editingId
      ? `http://localhost:5000/api/players/${editingId}`
      : "http://localhost:5000/api/players"

    const method = editingId ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to save player")
        return
      }

      await fetchPlayers()
      setShowModal(false)
      setEditingId(null)
      setFormData(initialFormData)
    } catch (err) {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    openConfirmModal({
      title: editingId ? "Update Player" : "Add Player",
      message: editingId
        ? "Are you sure you want to save these changes?"
        : "Are you sure you want to add this player?",
      type: "success",
      confirmText: editingId ? "Update" : "Add",
      onConfirm: savePlayer
    })
  }

  const deletePlayer = async (id) => {
    closeConfirmModal()

    try {
      const response = await fetch(`http://localhost:5000/api/players/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to delete player")
        return
      }

      await fetchPlayers()
    } catch (err) {
      setError("Cannot connect to server")
    }
  }

  const handleDelete = (id) => {
    openConfirmModal({
      title: "Delete Player",
      message: "This action cannot be undone. Are you sure you want to delete this player?",
      type: "danger",
      confirmText: "Delete",
      onConfirm: () => deletePlayer(id)
    })
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Players</h2>
          <p className="text-sm text-slate-500">
            Manage futsal VR participants assigned to your coach account
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600"
        >
          Add Player
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-500">
                <th className="py-3">Player ID</th>
                <th className="py-3">Name</th>
                <th className="py-3">Team</th>
                <th className="py-3">Level</th>
                <th className="py-3">Completed Drills</th>
                <th className="py-3">Score</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-sm text-slate-500">
                    No players added yet.
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player._id} className="border-b border-slate-100 text-sm">
                    <td className="py-4 font-medium">{player.studentId}</td>
                    <td className="py-4">{player.fullName}</td>
                    <td className="py-4">{player.team}</td>
                    <td className="py-4">{player.level}</td>
                    <td className="py-4">{player.completedDrills}</td>
                    <td className="py-4">{player.score}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(player)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(player._id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {editingId ? "Update Player" : "Add Player"}
                </h3>
                <p className="text-sm text-slate-500">
                  Fill out the player details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                placeholder="Player ID"
              />

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                placeholder="Full name"
              />

              <input
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                placeholder="Team"
              />

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
              >
                <option>Beginner</option>
                <option>Developing</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <input
                name="completedDrills"
                value={formData.completedDrills}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                type="number"
                placeholder="Completed drills"
              />

              <input
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                type="number"
                placeholder="Score"
              />

              <div className="flex gap-3 md:col-span-2">
                <button
                  disabled={loading}
                  className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                  {loading ? "Saving..." : editingId ? "Update Player" : "Add Player"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white ${
                  confirmModal.type === "danger"
                    ? "bg-red-500"
                    : confirmModal.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {confirmModal.type === "danger"
                  ? "!"
                  : confirmModal.type === "warning"
                  ? "?"
                  : "✓"}
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                {confirmModal.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {confirmModal.message}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${
                  confirmModal.type === "danger"
                    ? "bg-red-500 hover:bg-red-600"
                    : confirmModal.type === "warning"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}