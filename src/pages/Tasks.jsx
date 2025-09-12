import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks'
import { useState } from 'react'
import { Plus, Trash2, Loader2, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'high': return 'border-red-500';
    case 'medium': return 'border-yellow-500';
    default: return 'border-green-500';
  }
}

const getStatusStyles = (status) => {
  switch (status) {
    case 'done': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-red-100 text-red-800';
  }
};

export default function Tasks() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  // Le queryKey doit dépendre du rôle de l'utilisateur pour éviter les problèmes de cache.
  // Si un admin se connecte après un utilisateur normal, on veut être sûr de re-fetcher la liste complète des tâches.
  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ['tasks', user?.role],
    queryFn: getTasks,
    // On considère les données comme "fraîches" pendant 60 secondes.
    // Cela empêche les rafraîchissements automatiques (ex: au focus de la fenêtre) juste après une action,
    // ce qui est la cause de la disparition de la tâche fraîchement ajoutée.
    staleTime: 1000 * 60,
  })
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'pending' })

  const addTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (response) => { // `response` est la réponse de l'API contenant la nouvelle tâche
      // Au lieu de re-demander toute la liste au serveur (ce qui semble causer le problème),
      // nous allons mettre à jour manuellement le cache de React Query.
      // On ajoute directement la nouvelle tâche (reçue dans `response.data`) à la liste existante.
      queryClient.setQueryData(['tasks', user?.role], (oldData) => {
        const oldTasks = oldData || []
        return [...oldTasks, response.data]
      })
      toast.success('Tâche ajoutée !')
      setForm({ title: '', description: '', priority: 'medium', status: 'pending' })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout.')
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    // On met à jour manuellement le cache pour éviter de redemander les données au serveur.
    onSuccess: (updatedTask, variables) => {
      queryClient.setQueryData(['tasks', user?.role], (oldData) => {
        if (!oldData) return []
        return oldData.map(task =>
          task._id === variables.id ? { ...task, ...variables.data } : task
        )
      })
      toast.success('Tâche mise à jour !')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    }
  })

  const removeTaskMutation = useMutation({
    mutationFn: deleteTask,
    // On met à jour manuellement le cache ici aussi pour la cohérence.
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(['tasks', user?.role], (oldData) => {
        if (!oldData) return []
        return oldData.filter(task => task._id !== taskId)
      })
      toast.success('Tâche supprimée !')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
    }
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    addTaskMutation.mutate(form)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement des tâches</h1>
        <p className="text-gray-600 max-w-md">Impossible de récupérer les données depuis le serveur. Veuillez réessayer plus tard.</p>
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-left text-sm w-full max-w-md">
            <strong>Détail de l'erreur :</strong> {error?.response?.data?.message || error?.message || 'Erreur inconnue'}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.role === 'admin' ? 'Toutes les tâches' : 'Mes tâches'}
        </h1>
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          <input
            placeholder="Nouvelle tâche..."
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="md:col-span-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
            required
          />
          <input
            placeholder="Description (optionnel)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="md:col-span-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
          />
          <select
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={addTaskMutation.isPending}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {addTaskMutation.isPending ? (
            <><Loader2 size={20} className="animate-spin" /> Ajout...</>
          ) : (
            <><Plus size={20} /> Ajouter la tâche</>
          )}
        </button>
      </form>

      {/* Liste des tâches */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Tâche</th>
                {user?.role === 'admin' && <th scope="col" className="px-6 py-3">Créé par</th>}
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? tasks.map(task => (
                <tr key={task._id} className={`border-b hover:bg-gray-50 border-l-4 ${getPriorityStyles(task.priority)}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    <div className="text-gray-500">{task.description}</div>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        {task.createdBy?.name || 'N/A'}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskMutation.mutate({ id: task._id, data: { status: e.target.value } })}
                      className={`text-xs font-semibold rounded-full border-0 focus:ring-0 appearance-none p-1 ${getStatusStyles(task.status)}`}
                    >
                      <option value="pending">À faire</option>
                      <option value="in-progress">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeTaskMutation.mutate(task._id)}
                      disabled={removeTaskMutation.isPending && removeTaskMutation.variables === task._id}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Supprimer la tâche"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 4 : 3} className="text-center py-10 text-gray-500">
                    Aucune tâche pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
