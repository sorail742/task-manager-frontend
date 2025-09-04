import { useState } from 'react'
import { register } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      alert('Inscription réussie !')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Inscription</h2>
        <input type="text" placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-2 w-full mb-2" autoComplete="current-password"/>
        <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="border p-2 w-full mb-2 " autoComplete="current-password"/>
        <input type="password" placeholder="Mot de passe" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="border p-2 w-full mb-2" autoComplete="current-password"/>
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">S'inscrire</button>
         <p className="mt-4 text-center">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Connectez-vous
          </Link>
        </p>
      </form>
    </div>
  )
}
