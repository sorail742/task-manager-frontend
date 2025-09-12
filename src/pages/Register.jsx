import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { register } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { UserPlus, Loader2 } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      navigate('/login')
    },
    onError: (err) => {
      console.error('Erreur détaillée:', err)
      console.log('Réponse erreur:', err.response)
      toast.error(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Données envoyées:', form)
    registerMutation.mutate(form)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-600">Rejoignez notre plateforme de gestion de tâches</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nom</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nom"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Adresse e-mail</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adresse e-mail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button type="submit" disabled={registerMutation.isPending} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="absolute left-0 inset-y-0 flex items-center pl-3"><UserPlus className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" /></span>S'inscrire</>}
            </button>
          </div>
          <p className="mt-4 text-center text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Connectez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}