"use client"

import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2"

import { useAuth } from "@/context/AuthContext"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface RawUser {
  id: string
  name: string
  email: string
}

const USERS_PER_PAGE = 5

const AdminRoleAssigner = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchId, setSearchId] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  

  const { userData } = useAuth();
const token = userData?.token || "";


  const fetchAllUsersWithRoles = useCallback(async () => {
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch("https://arcana-back.onrender.com/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error(`Error al obtener usuarios: ${res.status}`)

      const rawUsers: RawUser[] = await res.json()

      const usersWithRoles: User[] = await Promise.all(
        rawUsers.map(async (user) => {
          try {
            const detailRes = await fetch(`https://arcana-back.onrender.com/users/${user.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!detailRes.ok) throw new Error("Error en detalles")

            const fullData = await detailRes.json()

            return {
              id: fullData.id,
              name: fullData.name,
              email: fullData.email,
              isAdmin: fullData.isAdmin ?? false,
            }
          } catch (error: unknown) {
            console.warn("❗ Error al obtener detalles del usuario:", user.id, error)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              isAdmin: false,
            }
          }
        })
      )

      const sorted = usersWithRoles.sort((a, b) =>
        a.isAdmin === b.isAdmin ? 0 : a.isAdmin ? -1 : 1
      )

      setUsers(sorted)
      setFilteredUsers(sorted)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido al obtener usuarios"
      setMessage(`❌ ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setMessage("⚠️ Token no disponible. Iniciá sesión nuevamente.")
      return
    }

    void fetchAllUsersWithRoles()
  }, [token, fetchAllUsersWithRoles])

  const handleAdminChange = async (userId: string, makeAdmin: boolean) => {
    const confirm = await Swal.fire({
      title: makeAdmin ? "¿Hacer admin?" : "¿Revocar admin?",
      text: makeAdmin
        ? "El usuario pasará a tener rol de administrador."
        : "El usuario ya no será administrador.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
    })

    if (!confirm.isConfirmed) return

    setLoading(true)

    try {
      const res = await fetch(`https://arcana-back.onrender.com/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: makeAdmin }),
      })

      if (!res.ok) throw new Error(`Error al modificar rol: ${res.status}`)

      const updated = users.map((u) =>
        u.id === userId ? { ...u, isAdmin: makeAdmin } : u
      )

      const sorted = updated.sort((a, b) =>
        a.isAdmin === b.isAdmin ? 0 : a.isAdmin ? -1 : 1
      )

      setUsers(sorted)
      setFilteredUsers(sorted)

      void Swal.fire({
        icon: "success",
        title: makeAdmin ? "✅ Rol asignado" : "🛑 Rol revocado",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      void Swal.fire("Error", msg, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchId.trim()) {
      setFilteredUsers(users)
    } else {
      const result = users.filter((u) =>
        u.id.toLowerCase().includes(searchId.trim().toLowerCase())
      )
      setFilteredUsers(result)
      setCurrentPage(1)
    }
  }

  const startIdx = (currentPage - 1) * USERS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + USERS_PER_PAGE)
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-black/80 text-white border border-yellow-500/20 rounded shadow-xl">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Gestión de Roles de Usuario</h2>

      {message && <p className="mb-4 text-sm text-yellow-300">{message}</p>}
      {loading && <p className="mb-4 text-yellow-400">⏳ Cargando usuarios...</p>}

      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 border border-yellow-500/20 text-white w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
        >
          Buscar
        </button>
      </div>

      <ul className="space-y-4">
        {paginatedUsers.map((user) => (
          <li
            key={user.id}
            className={`flex justify-between items-center p-4 rounded border ${
              user.isAdmin
                ? "bg-green-900/10 border-green-400/20"
                : "bg-gray-900 border-yellow-500/10"
            }`}
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-xs mt-1">
                {user.isAdmin ? (
                  <span className="text-green-400 font-semibold">Administrador</span>
                ) : (
                  <span className="text-yellow-400">Usuario regular</span>
                )}
              </p>
            </div>

            <button
              onClick={() => void handleAdminChange(user.id, !user.isAdmin)}
              disabled={loading}
              className={`px-3 py-1 rounded transition text-sm ${
                user.isAdmin
                  ? "bg-red-500 hover:bg-red-400 text-white"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
              }`}
            >
              {user.isAdmin ? "Revocar admin" : "Hacer admin"}
            </button>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3 text-sm">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-white hover:bg-yellow-600/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminRoleAssigner
