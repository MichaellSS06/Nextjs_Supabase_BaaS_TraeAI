"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import { CheckCircle, Dumbbell, ArrowLeft, Calendar, Clock } from "lucide-react"
import { useUserStore } from "@/lib/userStore"
import Link from "next/link"
import UserPointsCard from "@/components/UserPointsCard"

export default function WorkoutHistoryPage() {
  const supabase = createClientComponentClient()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      if (!user) {
        setLoading(false)
        return
      }

      // Trae historial con join a workouts
      const { data, error } = await supabase
        .from("user_workouts")
        .select(`
          id,
          completed_at,
          completed,
          created_at,
          workouts (
            id,
            name,
            difficulty,
            type,
            duration
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) setHistory(data)
      setLoading(false)
    }

    fetchHistory()
  }, [user])

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) return (
    <div className="mt-15 min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 mx-auto mb-4 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-indigo-500 animate-pulse"></div>
        </div>
        <p className="text-indigo-700 font-medium">Cargando historial...</p>
      </div>
    </div>
  )

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4 text-indigo-600 hover:text-indigo-800 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Historial de Entrenamientos</h1>
        </div>

        <UserPointsCard />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {history.length === 0 ? (
            <motion.div 
              variants={item}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin historial</h3>
              <p className="text-gray-500 mb-6">Aún no tienes entrenamientos completados.</p>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explorar entrenamientos
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {history.map((h, i) => (
                <motion.div
                  key={h.id}
                  variants={item}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg mr-4 ${h.completed ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          <Dumbbell className={`${h.completed ? 'text-green-600' : 'text-yellow-600'}`} size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{h.workouts?.name || "Entrenamiento"}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(h.created_at).toLocaleDateString("es", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${h.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {h.completed ? "Completado" : "En progreso"}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {h.workouts?.difficulty && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {h.workouts.difficulty}
                        </span>
                      )}
                      {h.workouts?.type && (
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                          {h.workouts.type}
                        </span>
                      )}
                      {h.workouts?.duration && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {h.workouts.duration} min
                        </span>
                      )}
                    </div>
                    
                    {h.completed_at && (
                      <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 mt-3">
                        Completado: {new Date(h.completed_at).toLocaleDateString("es", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Link 
                        href={`/workouts/${h.workouts?.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      )}
    </motion.div>
    </div>
    </div>
  )
}
