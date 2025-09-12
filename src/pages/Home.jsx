import { Link } from 'react-router-dom'
import { CheckCircle, Zap, Users } from 'lucide-react'

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Task Manager
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
              Se connecter
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              S'inscrire gratuitement
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-28 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Organisez votre travail et votre vie, enfin.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg lg:text-xl text-gray-600">
              Devenez concentré, organisé et calme avec Task Manager. La première application de gestion de tâches au monde.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 inline-block"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Une meilleure façon de gérer vos projets
              </h3>
              <p className="text-gray-600 mt-3 max-w-xl mx-auto">
                Gérez vos projets comme un pro, sans le prix d'un pro.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-8">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                  <Zap size={32} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Rapide et intuitif</h4>
                <p className="mt-2 text-gray-600">
                  Une interface conçue pour la vitesse. Ajoutez et organisez des tâches en quelques secondes.
                </p>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4 mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Suivi des progrès</h4>
                <p className="mt-2 text-gray-600">
                  Visualisez l'avancement de vos projets avec des statuts clairs et des tableaux de bord.
                </p>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-4 mx-auto">
                  <Users size={32} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Collaboration d'équipe</h4>
                <p className="mt-2 text-gray-600">
                  Invitez des membres, assignez des tâches et travaillez ensemble pour atteindre vos objectifs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Task Manager. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home