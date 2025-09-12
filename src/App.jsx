import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Register from './pages/Register'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Members from './pages/Members'
import NotFound from './pages/NotFound'
import { useAuth } from './context/AuthContext'
import Users from './pages/Users'
import Layout from './pages/Layout'

// Ce composant wrapper vérifie si l'utilisateur est connecté.
// Si c'est le cas, il affiche le Layout (avec Sidebar) et le contenu de la page (Outlet).
// Sinon, il redirige vers la page de login.
const ProtectedLayout = () => {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>

  return user ? <Layout><Outlet /></Layout> : <Navigate to="/login" />
}

export default function App() {
  const { user } = useAuth()
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/members" element={<Members />} />
          <Route path="/users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/dashboard" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
