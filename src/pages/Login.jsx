import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { login } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { LogIn, Loader2 } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login: doLogin } = useAuth()

  const loginMutation = useMutation({
    mutationFn: login, // ← J'AI AJOUTÉ CETTE LIGNE MANQUANTE !
    onSuccess: (response) => {
      console.log('Réponse login:', response)
      // On passe l'intégralité de la réponse (response.data) à la fonction de login du contexte.
      // C'est elle qui se chargera de stocker le token et de mettre à jour l'état de l'utilisateur.
      // C'est la cause la plus probable du problème de redirection.
      doLogin(response.data)
      toast.success('Connexion réussie !')
      navigate('/dashboard')
    },
    onError: (err) => {
      console.error('Erreur de connexion:', err)
      console.log('Réponse erreur:', err.response)
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect.')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Tentative de connexion avec:', form)
    loginMutation.mutate(form)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Se connecter</h2>
          <p className="mt-2 text-sm text-gray-600">Accédez à votre tableau de bord</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Adresse e-mail</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button type="submit" disabled={loginMutation.isPending} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="absolute left-0 inset-y-0 flex items-center pl-3"><LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" /></span>Se connecter</>}
            </button>
          </div>
          <p className="mt-4 text-center text-sm">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Inscrivez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}