import { Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="flex items-center h-16 px-6 bg-white border-b border-gray-200 shrink-0">
      {/* Barre de recherche */}
      <div className="relative hidden md:block">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher des tâches..."
          className="w-full max-w-xs pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
        />
      </div>
      {/* Icônes et profil utilisateur */}
      <div className="flex items-center space-x-6 ml-auto">
        <button className="relative text-gray-500 hover:text-gray-800">
          <Bell size={22} />
          {/* Point de notification avec animation */}
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm text-right hidden sm:block">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header