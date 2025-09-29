"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useWorkoutStore } from "@/lib/useWorkoutStore"
import { useUserStore } from "@/lib/userStore"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"

export default function ButtonWorkout({id}) {
  const supabase = createClientComponentClient()
  const setActiveWorkout = useWorkoutStore((state) => state.setActiveWorkout)
  const [loading, setLoading] = useState(false)
  const user = useUserStore((state) => state.user)
  const router = useRouter()
  console.log(id)
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

  return (
    <div className="p-6">      
      <motion.button
        onClick={handleStart}
        disabled={loading}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Iniciando..." : "Empezar entrenamiento"}
      </motion.button>
    </div>
  )
}
