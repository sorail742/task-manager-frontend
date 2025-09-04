import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Users() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/auth')
        .then(res => setUsers(res.data))
        .catch(err => alert(err.response?.data?.message || 'Erreur'))
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
    try {
      await api.delete(`/auth/${id}`)
      setUsers(users.filter(u => u._id !== id))
      alert('Utilisateur supprimé')
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tous les utilisateurs</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Rôle</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 border-b">{u.name}</td>
              <td className="p-3 border-b">{u.email}</td>
              <td className="p-3 border-b">
                <span className={`px-2 py-1 rounded-full text-white text-sm ${
                  u.role === 'admin' ? 'bg-purple-600' : 'bg-blue-500'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="p-3 border-b">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
