"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useWorkoutStore } from "@/lib/useWorkoutStore"
import { useUserStore } from "@/lib/userStore"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { PlayCircle } from "lucide-react"

export default function ButtonWorkout({id}) {
  const supabase = createClientComponentClient()
  const setActiveWorkout = useWorkoutStore((state) => state.setActiveWorkout)
  const [loading, setLoading] = useState(false)
  const user = useUserStore((state) => state.user)
  const router = useRouter()
  
  const handleStart = async () => {
    setLoading(true)
    // Insertar user_workout
    const { data: uw, error } = await supabase
      .from("user_workouts")
      .insert({
        user_id: user.id,
        workout_id: id,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      setLoading(false)
      return alert("Error al empezar el entrenamiento")
    }

    // Opcional: traer ejercicios del workout
    const { data: exercises } = await supabase
      .from("workout_exercises")
      .select(`
        sets, reps, rest,
        exercises ( id, name, description, video_url )
      `)
      .eq("workout_id", id)

    // Guardar en Zustand el user_workout con ejercicios
    setActiveWorkout({ ...uw, exercises })
    router.push("/dashboard")

    setLoading(false)
  }

  // Variantes para animaciones
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.98 },
    loading: { 
      scale: 1,
      opacity: 0.8,
    }
  }

  return (
    <div className="p-6 flex justify-center">      
      <motion.button
        onClick={handleStart}
        disabled={loading}
        className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md w-full md:w-auto"
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={loading ? "loading" : "initial"}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {loading ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            <span>Iniciando...</span>
          </>
        ) : (
          <>
            <PlayCircle size={20} />
            <span>Empezar entrenamiento</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
