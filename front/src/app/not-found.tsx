import Link from 'next/link'
import { Ghost, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b gflex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-purple-100 p-6 rounded-full">
            <Ghost className="w-16 h-16 text-purple-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-purple-900">404</h1>
          
          <h2 className="text-2xl font-semibold text-purple-800">Página no encontrada.</h2>
          
          <p className="text-purple-700">
            Lo sentimos, no hemos podido encontrar el camino místico que buscas.
          </p>
          
          <Link 
            href="/" 
            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}