import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { createMember, createAdmin } from '../services/auth'
import { UserPlus, Shield, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Members() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const addMemberMutation = useMutation({
    mutationFn: (userData) => {
      if (userData.role === 'admin' && user?.role === 'admin') {
        return createAdmin(userData)
      }
      return createMember(userData)
    },
    onSuccess: () => {
      toast.success('Utilisateur ajouté avec succès !')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setForm({ name: '', email: '', password: '', role: 'member' })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Une erreur est survenue.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addMemberMutation.mutate(form)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Ajouter un utilisateur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div className="relative">
          <input
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
            required
          />
          <label className="absolute left-0 -top-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
            Nom
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
            required
          />
          <label className="absolute left-0 -top-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
            required
          />
          <label className="absolute left-0 -top-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
            Mot de passe
          </label>
        </div>

        {/* Role */}
        {user?.role === 'admin' && (
          <div className="relative">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border-b-2 border-gray-300 focus:border-purple-500 outline-none py-2 appearance-none pr-8"
            >
              <option value="member">Membre</option>
              <option value="admin">Admin</option>
            </select>
            <span className="absolute right-0 top-2 text-gray-400">
              {form.role === 'admin' ? <Shield size={20} /> : <UserPlus size={20} />}
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          disabled={addMemberMutation.isPending}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addMemberMutation.isPending ? (
            <><Loader2 size={20} className="animate-spin" /> Ajout en cours...</>
          ) : (
            <><UserPlus size={20} /> Ajouter</>
          )}
        </button>
      </form>
    </div>
  )
}
