import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogOut, UserPlus, Users, ListChecks } from "lucide-react"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tableau de bord</h2>
        <nav className="flex flex-wrap gap-3 mt-4">
            {/* Tâches */}
            <Link
              to="/tasks"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition"
            >
              <ListChecks size={18} />
              <span>Tâches</span>
            </Link>

            {/* Admin seulement */}
            {user?.role === "admin" && (
              <>
                <Link
                  to="/members"
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-600 transition"
                >
                  <UserPlus size={18} />
                  <span>Ajouter un utilisateur</span>
                </Link>

                <Link
                  to="/users"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600 transition"
                >
                  <Users size={18} />
                  <span>Gérer les utilisateurs</span>
                </Link>
              </>
            )}
          </nav>
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenue, {user?.name}
        </h1>
        <p className="text-gray-600 mb-6">Rôle : <span className="font-medium">{user?.role}</span></p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📌 Tâches</h3>
            <p className="text-gray-600 mb-3">Gérez vos tâches quotidiennes.</p>
            <Link to="/tasks" className="text-blue-600 hover:underline">Voir mes tâches →</Link>
          </div>

          {user?.role === "admin" && (
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 Gestion des membres</h3>
              <p className="text-gray-600 mb-3">Ajoutez ou supprimez des membres et admins.</p>
              <Link to="/members" className="text-purple-600 hover:underline">Gérer les membres →</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
