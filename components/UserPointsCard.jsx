"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import { useUserStore } from "@/lib/userStore"
import { Star, Award, Crown } from "lucide-react"

export default function UserPointsCard() {
  const supabase = createClientComponentClient()
  const user = useUserStore((state) => state.user)
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPoints = async () => {
      if (!user) return
      setLoading(true)
      const { data, error } = await supabase
        .from("user_points")
        .select("points, level")
        .eq("user_id", user.id)
        .single()

      if (!error && data) {
        setPoints(data.points)
        setLevel(data.level)
      }
      setLoading(false)
    }

    fetchPoints()
  }, [user])

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl shadow text-center">
        <p className="text-gray-600">Cargando puntos...</p>
      </div>
    )
  }

  // 🎨 Estilos según nivel
  const levelStyles = {
    1: "from-gray-100 to-gray-200 border-gray-300",
    2: "from-blue-100 to-blue-200 border-blue-400",
    3: "from-purple-100 to-purple-200 border-purple-400",
    4: "from-yellow-100 to-yellow-200 border-yellow-400",
  }

  const icons = {
    1: <Star className="text-gray-600" size={40} />,
    2: <Star className="text-blue-600" size={40} />,
    3: <Award className="text-purple-600" size={40} />,
    4: <Crown className="text-yellow-500" size={40} />,
  }

  const levelNames = {
    1: "Principiante",
    2: "Constante",
    3: "Avanzado",
    4: "Leyenda",
  }

  // 📊 Calcular progreso al siguiente nivel
  const levelThresholds = [0, 100, 250, 500]
  const nextThreshold = level < 4 ? levelThresholds[level] : points
  const prevThreshold = levelThresholds[level - 1] || 0
  const progress = level < 4 
    ? ((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100 
    : 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-xl shadow-lg border bg-gradient-to-r ${levelStyles[level]} flex flex-col items-center text-center`}
    >
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {icons[level]}
      </motion.div>

      <h2 className="text-xl font-bold mt-3">{levelNames[level]}</h2>
      <p className="text-gray-700 mt-2">
        Nivel <span className="font-semibold">{level}</span>
      </p>

      {/* Puntos */}
      <motion.p
        className="text-lg font-semibold mt-4 bg-white px-4 py-2 rounded-full shadow"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        ⭐ {points} puntos
      </motion.p>

      {/* Barra de progreso */}
      <div className="w-full mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{points} pts</span>
          {level < 4 ? <span>{nextThreshold} pts</span> : <span>MAX</span>}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}
