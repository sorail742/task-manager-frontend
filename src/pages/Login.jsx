import { useState } from 'react'
import { login } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login: doLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await login(form)
      doLogin(data)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Connexion</h2>
        <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="border p-2 w-full mb-2" autoComplete="current-password"/>
        <input type="password" placeholder="Mot de passe" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="border p-2 w-full mb-2" autoComplete="current-password"/>
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">Se connecter</button>
         <p className="mt-4 text-center">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-500 underline">
            Inscrivez-vous
          </Link>
        </p>
      </form>
    </div>
  )
}
