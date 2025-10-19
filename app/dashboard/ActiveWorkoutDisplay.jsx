"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useWorkoutStore } from "@/lib/useWorkoutStore"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ActiveWorkoutDisplay({user}) {
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout)
  const setActiveWorkout = useWorkoutStore((state) => state.setActiveWorkout)
  const clearWorkout = useWorkoutStore((state) => state.clearWorkout)
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  console.log(activeWorkout)
  const hasHydrated = useWorkoutStore((s) => s.hasHydrated)

  useEffect(() => {
    const fetchLastWorkout = async () => {
      if (activeWorkout || !user) return

      // 1. Obtener el último user_workout
      const { data: uw, error } = await supabase
        .from("user_workouts")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
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
  }, [user, activeWorkout, setActiveWorkout])

  const handleComplete = async () => {
    setLoading(true)
    
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

    clearWorkout()
    alert(`¡Entrenamiento completado! Puntos ganados: ${data.newPoints}`)
  }
  
  // Variantes para animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  if (!hasHydrated) {
    return (
      <div className="mt-8 p-6 text-center text-indigo-600 animate-pulse">
        Cargando estado del entrenamiento...
      </div>
    )
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg max-w-2xl w-full border border-indigo-100"
    >
      <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Entrenamiento Activo
      </h3>
      
      {activeWorkout ? (
        <motion.div 
          className="space-y-6"
          //variants={container}
          //initial="hidden"
          //animate="show"
        >
          <motion.div variants={item} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Fecha de inicio</span>
                <span className="font-medium">{new Date(activeWorkout.created_at).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">ID Entrenamiento</span>
                <span className="font-medium">{activeWorkout.workout_id}</span>
              </div>
            </div>
          </motion.div>
          
          {activeWorkout.exercises && (
            <motion.div variants={item} className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Ejercicios</h4>
              <div className="space-y-3">
                {activeWorkout.exercises.map((ex, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-200 transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">{ex.exercises?.name || 'Ejercicio'}</h5>
                      {ex.exercises?.video_url && (
                        <a 
                          href={ex.exercises.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 text-sm hover:underline"
                        >
                          Ver video
                        </a>
                      )}
                    </div>
                    <div className="mt-2 flex gap-3 text-sm">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        {ex.sets} series
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {ex.reps} reps
                      </span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        {ex.rest}s descanso
                      </span>
                    </div>
                    {ex.exercises?.description && (
                      <p className="text-sm text-gray-600 mt-2">{ex.exercises.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          <motion.div variants={item} className="mt-6">
            <motion.button
              onClick={handleComplete}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'} transition-all shadow-md`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Marcar como Completado
                </span>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="bg-gray-50 rounded-lg p-6 inline-block mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <p className="text-gray-600 mb-2">No tienes un entrenamiento activo</p>
            <p className="text-sm text-gray-500">Selecciona un entrenamiento para comenzar</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )}
          
//           <div className="mt-4">
//             <h4 className="font-medium mb-2">Ejercicios:</h4>
//             {activeWorkout.exercises && activeWorkout.exercises.length > 0 ? (
//               <div className="space-y-3">
//                 {activeWorkout.exercises.map((exercise, index) => (
//                   <div key={index} className="bg-gray-50 p-3 rounded-lg">
//                     <p className="font-medium">{exercise.exercises.name}</p>
//                     <p className="font-medium">{exercise.exercises.description}</p>
//                     <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
//                       <p>Sets: {exercise.sets}</p>
//                       <p>Reps: {exercise.reps}</p>
//                       <p>Descanso: {exercise.rest}s</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No hay ejercicios disponibles</p>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500">No hay entrenamiento activo</p>
//       )}

//       <motion.button
//         onClick={handleComplete}
//         disabled={loading}
//         className="bg-green-600 text-white px-4 py-2 rounded-lg"
//       >
//         {loading ? "Guardando..." : "Completar entrenamiento"}
//       </motion.button>
//     </motion.div>
//   )
// }