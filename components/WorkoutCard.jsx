"use client"

import { useRouter } from "next/navigation"

export default function WorkoutCard({ workout }) {
  const router = useRouter()

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
      <h3 className="text-lg font-bold">{workout.name}</h3>
      <p className="text-sm text-gray-500">Dificultad: {workout.difficulty}</p>
      <p className="text-sm text-gray-500">Tipo: {workout.type}</p>
      <p className="text-sm text-gray-500">Duración: {workout.duration} min</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => router.push(`/workouts/${workout.id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  )
}
