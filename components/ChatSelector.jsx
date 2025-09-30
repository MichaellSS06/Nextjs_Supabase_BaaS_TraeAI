"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUserStore } from "@/lib/userStore"

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

  if (loading) return <p>Cargando chats...</p>
  if (!rooms.length) return <p>No tienes chats disponibles.</p>

  return (
    <div className="space-y-3">
      {rooms.map((room) =>
        room.type === "global" ? (
          <Link
            key={room.id}
            href="/chat/global"
            className="block p-4 border rounded bg-white shadow hover:bg-gray-50"
          >
            🌍 Chat Global
          </Link>
        ) : (
          <Link
            key={room.id}
            href={`/chat/${room.workout_id}`}
            className="block p-4 border rounded bg-white shadow hover:bg-gray-50"
          >
            💪 Chat de {room.workouts?.name || "Workout"}
          </Link>
        )
      )}
    </div>
  )
}
