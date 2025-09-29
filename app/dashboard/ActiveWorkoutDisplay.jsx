"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useWorkoutStore } from "@/lib/useWorkoutStore"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ActiveWorkoutDisplay({user}) {
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout)
  const setActiveWorkout = useWorkoutStore((state) => state.setActiveWorkout)
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  console.log(activeWorkout)

  useEffect(() => {
    const fetchLastWorkout = async () => {
      if (activeWorkout || !user) return

      // 1. Obtener el último user_workout
      const { data: uw, error } = await supabase
        .from("user_workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error || !uw) {
        console.log("No hay entrenamientos previos", error)
        return
      }

      // 2. Obtener ejercicios del workout
      const { data: exercises, error: exError } = await supabase
        .from("workout_exercises")
        .select(`
          sets, reps, rest,
          exercises ( id, name, description, video_url )
        `)
        .eq("workout_id", uw.workout_id)

      if (exError) {
        console.error("Error al traer ejercicios", exError)
        return
      }

      // 3. Guardar todo en Zustand
      setActiveWorkout({ ...uw, exercises })
    }

    fetchLastWorkout()
  }, [])

  const handleComplete = async () => {
    setLoading(true)
    console.log(activeWorkout.workout_id)
    // llamar a la edge function
    const { data, error } = await supabase.functions.invoke("completeWorkout", {
      body: { 
        user_id: user.id,
        user_workout_id: activeWorkout.id
      }
    })

    setLoading(false)

    if (error) {
      console.error(error)
      return alert("Error al completar entrenamiento")
    }

    console.log("✅ Resultado:", data)
    alert("Entrenamiento marcado como completado" + `Puntos: ${data.newPoints}`)
  }

  // if (!activeWorkout && !user) {
  //   return <p className="p-6">Cargando tu último entrenamiento...</p>
  // }
  
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

      <motion.button
        onClick={handleComplete}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Guardando..." : "Completar entrenamiento"}
      </motion.button>
    </motion.div>
  )
}