import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Members from './pages/Members'
import NotFound from './pages/NotFound'
import { useAuth } from './context/AuthContext'
import Users from './pages/Users'

export default function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/members" element={user?.role === 'admin' ? <Members /> : <Navigate to="/" />} />
      <Route path="/users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
