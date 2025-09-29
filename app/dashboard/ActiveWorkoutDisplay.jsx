"use client"

import { motion } from "framer-motion"
import { useWorkoutStore } from "@/lib/useWorkoutStore"

export default function ActiveWorkoutDisplay() {
  const { activeWorkout } = useWorkoutStore()
  console.log(activeWorkout)
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 bg-white rounded-xl shadow-lg max-w-2xl w-full"
    >
      <h3 className="text-lg font-bold mb-4">Entrenamiento Activo</h3>
      {activeWorkout ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">ID:</span>
            <span>{activeWorkout.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Usuario ID:</span>
            <span>{activeWorkout.user_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Entrenamiento ID:</span>
            <span>{activeWorkout.workout_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Creado:</span>
            <span>{activeWorkout.completed}</span>
            <span>{activeWorkout.completed_at}</span>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Ejercicios:</h4>
            {activeWorkout.exercises && activeWorkout.exercises.length > 0 ? (
              <div className="space-y-3">
                {activeWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{exercise.exercises.name}</p>
                    <p className="font-medium">{exercise.exercises.description}</p>
                    <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
                      <p>Sets: {exercise.sets}</p>
                      <p>Reps: {exercise.reps}</p>
                      <p>Descanso: {exercise.rest}s</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay ejercicios disponibles</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No hay entrenamiento activo</p>
      )}
    </motion.div>
  )
}