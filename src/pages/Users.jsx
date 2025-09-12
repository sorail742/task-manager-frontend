import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Users() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users')
      // S'assurer que la réponse est bien un tableau pour éviter les erreurs
      return Array.isArray(data) ? data : []
    },
    // La requête ne s'exécute que si l'utilisateur est admin
    enabled: user?.role === 'admin',
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès !')
      // Invalide le cache et redéclenche la requête 'users' pour mettre à jour la liste
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression')
    },
  })

  const handleDelete = (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
    deleteUserMutation.mutate(id)
  }

  // --- Préparation des données pour le graphique ---
  const roleCounts = users.reduce((acc, currentUser) => {
    const role = currentUser.role || 'member' // 'member' par défaut pour la cohérence
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {})

  const roleData = Object.entries(roleCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']

  // --- Label customisé pour le graphique ---
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Masquer le label pour les petites parts

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des Utilisateurs</h1>
        <p className="text-gray-600">Chargement des données...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>

      {/* Section Stats et Graphique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-lg rounded-2xl flex flex-col justify-center">
          <h3 className="text-base font-semibold text-gray-500">Utilisateurs Totaux</h3>
          <p className="text-5xl font-bold text-gray-800 mt-2">{users.length}</p>
        </div>
        <div className="lg:col-span-2 p-6 bg-white shadow-lg rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition des Rôles</h3>
          {users.length > 0 ? (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} utilisateur(s)`, name]} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              Pas de données à afficher pour le graphique.
            </div>
          )}
        </div>
      </div>

      {/* Section Tableau des Utilisateurs */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Liste des utilisateurs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Nom</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Rôle</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="bg-white border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user?._id !== u._id && ( // Empêche l'admin de se supprimer lui-même
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                        aria-label={`Supprimer l'utilisateur ${u.name}`}
                      >
                        <Trash2 size={16} />
                        <span>Supprimer</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}