import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Users, UserPlus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Vous avez été déconnecté.')
    navigate('/login')
  }

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <aside className="flex flex-col h-screen w-64 border-r border-gray-200 bg-white shrink-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600">Task Manager</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to="/dashboard" end className={navLinkClasses}>
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={navLinkClasses}>
          <ClipboardList className="mr-3 h-5 w-5" />
          Tâches
        </NavLink>
        {user?.role === 'admin' && (
          <>
            <NavLink to="/users" className={navLinkClasses}>
              <Users className="mr-3 h-5 w-5" />
              Utilisateurs
            </NavLink>
            <NavLink to="/members" className={navLinkClasses}>
              <UserPlus className="mr-3 h-5 w-5" />
              Ajouter un membre
            </NavLink>
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-100 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

export default Sidebar