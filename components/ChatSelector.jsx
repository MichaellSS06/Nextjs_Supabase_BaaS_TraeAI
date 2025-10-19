"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUserStore } from "@/lib/userStore"
import { motion } from "framer-motion"

export default function ChatSelector() {
  const supabase = createClientComponentClient()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)

      if (!user) {
        setRooms([])
        setLoading(false)
        return
      }

      // 1. Sala global
      const { data: globalRoom } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("type", "global")
        .single()

      // 2. Workouts en los que participa
      const { data: workoutRooms } = await supabase
        .from("chat_rooms")
        .select("id, type, workout_id, workouts(name)")
        .eq("type", "workout")
        .in(
          "workout_id",
          (
            await supabase
              .from("user_workouts")
              .select("workout_id")
              .eq("user_id", user.id)
          ).data?.map((uw) => uw.workout_id) || []
        )

      setRooms([
        ...(globalRoom ? [globalRoom] : []),
        ...(workoutRooms || []),
      ])
      setLoading(false)
    }

    fetchRooms()
  }, [supabase, user])

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
    <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 rounded-full bg-indigo-500 animate-pulse"></div>
        <p className="text-indigo-700 font-medium">Cargando chats...</p>
      </div>
    </div>
  )
  
  if (!rooms.length) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm text-center"
    >
      <p className="text-gray-600">No tienes chats disponibles.</p>
    </motion.div>
  )

  return (
    <motion.div 
      className="space-y-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Tus Chats</h3>
      
      {rooms.map((room, index) =>
        room.type === "global" ? (
          <motion.div key={room.id} variants={item}>
            <Link
              href="/chat/global"
              className="block p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌍</span>
                <div>
                  <span className="font-medium">Chat Global</span>
                  <p className="text-xs text-blue-100">Conecta con toda la comunidad</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div key={room.id} variants={item}>
            <Link
              href={`/chat/${room.workout_id}`}
              className="block p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-indigo-500"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">💪</span>
                <div>
                  <span className="font-medium text-gray-800">Chat de {room.workouts?.name || "Workout"}</span>
                  <p className="text-xs text-gray-500">Discute tu progreso y dudas</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      )}
    </motion.div>
  )
}
