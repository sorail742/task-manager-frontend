import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api" // <-- ton axios instance

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // 🔹 Vérifier la validité du token avec l'API
          const res = await api.get("/auth/me")
          setUser(res.data)
          localStorage.setItem("user", JSON.stringify(res.data))
        } catch (err) {
          console.error("Token invalide ou expiré:", err.response?.data)
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [token])

  const login = (data) => {
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
