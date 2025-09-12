import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import { Users, ClipboardList, ClipboardCheck, Clock, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Helper pour traduire les statuts de l'API en français
const formatStatus = (status) => {
  const statusMap = {
    pending: 'À faire',
    'in-progress': 'En cours',
    done: 'Terminé',
  };
  return statusMap[status] || status;
};

const StatCard = ({ icon, title, value, color, isLoading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {isLoading ? (
        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1" />
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth(); // On récupère l'utilisateur pour le queryKey

  // Récupération des tâches et des utilisateurs depuis l'API
  const { data: tasks = [], isLoading: isLoadingTasks, isError: isErrorTasks, error: tasksError } = useQuery({
    // On ajoute le rôle au queryKey pour s'assurer que les données sont re-fetchées
    // lors d'un changement d'utilisateur (ex: membre -> admin).
    queryKey: ['tasks', user?.role],
    queryFn: () => api.get('/tasks').then(res => res.data),
  });

  const { data: users = [], isLoading: isLoadingUsers, isError: isErrorUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
    // On n'active cette requête que si l'utilisateur est un admin.
    // Cela empêche les erreurs pour les utilisateurs normaux qui n'ont pas le droit de voir la liste,
    // et résout le problème d'affichage du dashboard pour eux.
    enabled: user?.role === 'admin',
  });

  const isLoading = isLoadingTasks || isLoadingUsers;

  // --- Traitement des données pour les statistiques et graphiques ---
  const statsData = React.useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    return {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      totalMembers: users.length,
    };
  }, [tasks, users]);

  const tasksByStatusData = React.useMemo(() => 
    ['pending', 'in-progress', 'done'].map(status => ({
      name: formatStatus(status),
      count: tasks.filter(task => task.status === status).length,
    })), [tasks]);

  const tasksOverTimeData = React.useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { month: d.getMonth(), year: d.getFullYear(), name: d.toLocaleString('fr-FR', { month: 'short' }) };
    }).reverse();

    return months.map(m => ({
      name: m.name.charAt(0).toUpperCase() + m.name.slice(1),
      tâches: tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.getMonth() === m.month && taskDate.getFullYear() === m.year;
      }).length,
    }));
  }, [tasks]);

  const recentTasksData = React.useMemo(() => 
    tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(task => ({
        ...task,
        user: task.createdBy?.name || 'Non assigné',
      })), [tasks]);

  // Gestion de l'état d'erreur de connexion
  if (isErrorTasks || isErrorUsers) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement du tableau de bord</h1>
        <p className="text-gray-600 max-w-md">Une ou plusieurs requêtes au serveur ont échoué. Voici les détails des erreurs :</p>
        {isErrorTasks && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-left text-sm w-full max-w-md">
            <strong>Erreur (tâches):</strong> {tasksError?.response?.data?.message || tasksError?.message || 'Erreur inconnue'}
          </div>
        )}
        {isErrorUsers && (
          <div className="mt-2 p-3 bg-red-100 text-red-800 rounded-md text-left text-sm w-full max-w-md">
            <strong>Erreur (utilisateurs):</strong> {usersError?.response?.data?.message || usersError?.message || 'Erreur inconnue'}
          </div>
        )}
      </div>
    );
  }

  return (
    // Le style de fond et la hauteur sont maintenant gérés par le composant Layout parent.
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/tasks" className="block transition-transform duration-200 ease-in-out hover:scale-105">
          <StatCard 
            icon={<ClipboardList size={24} className="text-blue-500" />}
            title="Tâches totales"
            value={statsData.totalTasks}
            color="bg-blue-100"
            isLoading={isLoading}
          />
        </Link>
        <Link to="/tasks" className="block transition-transform duration-200 ease-in-out hover:scale-105">
          <StatCard 
            icon={<Clock size={24} className="text-yellow-500" />}
            title="Tâches en attente"
            value={statsData.pendingTasks}
            color="bg-yellow-100"
            isLoading={isLoading}
          />
        </Link>
        <Link to="/tasks" className="block transition-transform duration-200 ease-in-out hover:scale-105">
          <StatCard 
            icon={<ClipboardCheck size={24} className="text-green-500" />}
            title="Tâches terminées"
            value={statsData.completedTasks}
            color="bg-green-100"
            isLoading={isLoading}
          />
        </Link>
        {user?.role === 'admin' ? (
          <Link to="/users" className="block transition-transform duration-200 ease-in-out hover:scale-105">
            <StatCard icon={<Users size={24} className="text-purple-500" />} title="Membres de l'équipe" value={statsData.totalMembers} color="bg-purple-100" isLoading={isLoading} />
          </Link>
        ) : (
          <StatCard icon={<Users size={24} className="text-purple-500" />} title="Membres de l'équipe" value={statsData.totalMembers} color="bg-purple-100" isLoading={isLoading} />
        )}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tâches par statut</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksByStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Nombre de tâches" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Création de tâches (6 derniers mois)</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tasksOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tâches" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tableau des tâches récentes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Tâches récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 font-medium text-gray-600">Tâche</th>
                <th className="p-4 font-medium text-gray-600">Assigné à</th>
                <th className="p-4 font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Chargement...
                    </div>
                  </td>
                </tr>
              ) : recentTasksData.length > 0 ? (
                recentTasksData.map((task, index) => (
                  <tr key={task._id} className={`border-b hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4 text-gray-800 font-medium">{task.title}</td>
                    <td className="p-4 text-gray-600">{task.user}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatStatus(task.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">Aucune tâche récente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;