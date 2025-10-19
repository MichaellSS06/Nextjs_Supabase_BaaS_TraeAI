"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function WorkoutCard({ workout }) {
  const router = useRouter()

  // Determinar el color de fondo según la dificultad
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'fácil':
      case 'facil':
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medio':
      case 'medium':
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'difícil':
      case 'dificil':
      case 'hard':
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <motion.div 
      className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      <div className="bg-indigo-50 p-4 border-b border-indigo-100">
        <h3 className="text-lg font-bold text-gray-800">{workout.name}</h3>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
            {workout.difficulty}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
            {workout.type}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {workout.duration} min
          </span>
        </div>
        
        {workout.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workout.description}</p>
        )}
        
        <motion.button
          onClick={() => router.push(`/workouts/${workout.id}`)}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver Detalles
        </motion.button>
      </div>
    </motion.div>
  )
}
