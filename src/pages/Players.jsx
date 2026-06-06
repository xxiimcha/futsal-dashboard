import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import API_URL from "../config/api"

const positionOptions = [
  {
    value: "Pivot",
    title: "Pivot",
    subtitle: "Target",
    description: "Main scorer; receives passes and finishes attacks."
  },
  {
    value: "Ala",
    title: "Ala",
    subtitle: "Left/Right Winger",
    description: "Supports both offense and defense; creates chances and helps defend."
  },
  {
    value: "Fixo",
    title: "Fixo",
    subtitle: "Fixed Defender",
    description: "Defensive leader; stops attacks and starts the build-up."
  },
  {
    value: "Goalkeeper",
    title: "Goalkeeper",
    subtitle: "Keeper",
    description: "Protects the goal and initiates counterattacks."
  }
]

const initialFormData = {
  studentId: "",
  fullName: "",
  team: "",
  position: "Pivot"
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

  const selectedPosition = positionOptions.find(
    (position) => position.value === formData.position
  )

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/players`, {
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
      [name]: value
    })
  }

  const handlePlayerIdChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 4)

    setFormData({
      ...formData,
      studentId: numbersOnly ? `P${numbersOnly}` : ""
    })
  }

  const getPlayerIdNumber = () => {
    return formData.studentId.replace("P", "")
  }

  const openConfirmModal = ({
    title,
    message,
    type = "default",
    confirmText = "Confirm",
    onConfirm
  }) => {
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
      studentId: player.studentId || "",
      fullName: player.fullName || "",
      team: player.team || "",
      position: player.position || "Pivot"
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
      ? `${API_URL}/api/players/${editingId}`
      : `${API_URL}/api/players`

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

    if (!/^P[0-9]{4}$/.test(formData.studentId)) {
      setError("Player ID must contain exactly 4 numbers. Example: P0001.")
      return
    }

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
      const response = await fetch(`${API_URL}/api/players/${id}`, {
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
          <h2 className="text-2xl font-bold text-slate-800">Players</h2>
          <p className="text-sm text-slate-500">
            Manage futsal VR participants assigned to your coach account
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600"
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
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-800">Player List</h3>
          <p className="text-sm text-slate-500">
            View and manage player profile details and futsal positions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-sm text-slate-500">
                <th className="rounded-l-xl px-4 py-3">Player ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Position</th>
                <th className="rounded-r-xl px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-slate-500">
                    No players added yet.
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr
                    key={player._id}
                    className="border-b border-slate-100 text-sm hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {player.studentId}
                    </td>

                    <td className="px-4 py-4">{player.fullName}</td>

                    <td className="px-4 py-4">{player.team || "-"}</td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        {player.position || "Pivot"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingId ? "Update Player" : "Add Player"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter player details and assign the correct futsal position.
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

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="grid flex-1 gap-6 overflow-y-auto px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h4 className="mb-4 text-base font-bold text-slate-800">
                    Player Information
                  </h4>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Player ID
                      </label>

                      <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-green-500">
                        <span className="flex items-center bg-slate-100 px-4 text-sm font-bold text-slate-600">
                          P
                        </span>

                        <input
                          name="studentId"
                          value={getPlayerIdNumber()}
                          onChange={handlePlayerIdChange}
                          className="w-full px-4 py-3 outline-none"
                          placeholder="0001"
                          inputMode="numeric"
                          maxLength="4"
                          required
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Enter 4 numbers only. Example: 0001 will be saved as P0001.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Full Name
                      </label>

                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                        placeholder="Full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Team
                      </label>

                      <input
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                        placeholder="Team"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Position
                      </label>

                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                      >
                        {positionOptions.map((position) => (
                          <option key={position.value} value={position.value}>
                            {position.title} - {position.subtitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <aside className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                    Selected Position
                  </p>

                  <h4 className="mt-2 text-2xl font-bold text-slate-800">
                    {selectedPosition?.title}
                  </h4>

                  <p className="text-sm font-semibold text-green-700">
                    {selectedPosition?.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedPosition?.description}
                  </p>

                  <div className="mt-5 grid gap-3">
                    {positionOptions.map((position) => (
                      <button
                        key={position.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            position: position.value
                          })
                        }
                        className={`rounded-xl border p-3 text-left transition ${
                          formData.position === position.value
                            ? "border-green-400 bg-white shadow-sm"
                            : "border-green-100 bg-white/70 hover:border-green-300 hover:bg-white"
                        }`}
                      >
                        <p className="text-sm font-bold text-slate-800">
                          {position.title}{" "}
                          <span className="font-medium text-slate-500">
                            ({position.subtitle})
                          </span>
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {position.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </aside>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                  {loading ? "Saving..." : editingId ? "Update Player" : "Add Player"}
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