import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks'
import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'

export default function Tasks() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })
  const [form, setForm] = useState({ title: '', description: '', priority: 'low', status: 'pending' })

  const addTask = useMutation({ mutationFn: createTask, onSuccess: ()=> queryClient.invalidateQueries(['tasks']) })
  const editTask = useMutation({ mutationFn: ({id,data}) => updateTask(id,data), onSuccess: ()=> queryClient.invalidateQueries(['tasks']) })
  const removeTask = useMutation({ mutationFn: deleteTask, onSuccess: ()=> queryClient.invalidateQueries(['tasks']) })

  const handleSubmit = e => {
    e.preventDefault()
    addTask.mutate(form)
    setForm({ title: '', description: '', priority: 'low', status: 'pending' })
  }

  if (isLoading) return <p className="text-center text-gray-500 mt-4">Chargement...</p>

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Mes tâches</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-md">
        <input
          placeholder="Titre"
          value={form.title}
          onChange={e=>setForm({...form,title:e.target.value})}
          className="border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-2 col-span-1 sm:col-span-1"
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e=>setForm({...form,description:e.target.value})}
          className="border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-2 col-span-1 sm:col-span-2"
          required
        />
        <select
          value={form.priority}
          onChange={e=>setForm({...form,priority:e.target.value})}
          className="border-b-2 border-gray-300 focus:border-purple-500 outline-none py-2 px-2 col-span-1"
        >
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl hover:from-indigo-600 hover:to-blue-500 flex justify-center items-center gap-2 col-span-1 sm:col-span-1">
          <Check size={20} /> Ajouter
        </button>
      </form>

      {/* Liste des tâches */}
      <div className="space-y-4">
        {data?.data?.map(t => (
          <div key={t._id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition-shadow">
            <div>
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-gray-600">{t.description}</p>
              <span className={`text-white text-xs px-2 py-1 rounded ${getPriorityColor(t.priority)}`}>
                Priorité: {t.priority.toUpperCase()}
              </span>
              <span className="ml-2 text-gray-500 text-sm">Statut: {t.status}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={()=>editTask.mutate({id:t._id,data:{status:'done'}})}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Check size={16}/> Fait
              </button>
              <button
                onClick={()=>removeTask.mutate(t._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Trash2 size={16}/> Suppr
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
