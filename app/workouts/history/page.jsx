"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import { CheckCircle, Dumbbell } from "lucide-react"
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
          workouts (
            id,
            name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) setHistory(data)
      setLoading(false)
    }

    fetchHistory()
  }, [user])

  console.log(history)

  if (loading) return <p className="p-6 text-gray-600">Cargando historial...</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-center">
            <Link href="/dashboard" className="hover:text-blue-400 transition p-4 text-center font-medium">Dashboard</Link>
      </div>

      <UserPointsCard />

      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Historial de Workouts
      </motion.h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">Aún no tienes workouts completados.</p>
      ) : (
        <div className="space-y-4">
          {history.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-white rounded-xl shadow p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Dumbbell className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{h.workouts?.name}</p>
                  <p className="font-semibold text-gray-800">{h.completed ? "Completado" : "No completado"}</p>
                  {h.completed_at && <p className="text-sm text-gray-500">
                    {new Date(h.completed_at).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>}
                </div>
              </div>
              <CheckCircle className="text-green-500" size={28} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
