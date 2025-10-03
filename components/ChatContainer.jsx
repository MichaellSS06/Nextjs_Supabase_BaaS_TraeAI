"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUserStore } from "@/lib/userStore"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"

export default function ChatContainer({ roomId, initialMessages = [] }) {
  // Usar useMemo para crear una instancia estable de supabase
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [messages, setMessages] = useState(initialMessages)
  const scrollRef = useRef(null)
  const channelRef = useRef(null)
  const [profilesMap, setProfilesMap] = useState({})
  const user = useUserStore((state) => state.user)
  // const profile = useUserStore((state) => state.profile)
  // console.log(user)
  // console.log(profile)

  useEffect(() => {
    // Al montar, traemos todos los perfiles de los user_id que existen en la room
    const fetchProfiles = async () => {
      const { data } = await supabase.from("profiles").select("id, username")
      const map = Object.fromEntries(data.map(p => [p.id, p.username]))
      setProfilesMap(map)
    }
    fetchProfiles()
  }, [])

  useEffect(() => {
    const setupRealtime = async () => {
      if (!roomId) return // evitar suscribirse con undefined
        // 🔑 Esto asegura que el cliente tenga la sesión actual
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error obteniendo sesión:", error)
        return
      }
      if (!session) {
        console.warn("No hay sesión activa")
        return
      }
      console.log("Sesion cargada ✅:", session.user.id)
      console.log("🔄 Suscribiendo a room:", roomId)

      // Limpiar canal anterior
      if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
      }

      // Crear canal único
      const channel = supabase.channel(`chat_room_${roomId}`)
      channel
          .on(
          "postgres_changes",
          {
              event: "INSERT",
              schema: "public",
              table: "chat_messages",
              filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
              console.log("📩 Nuevo mensaje:", payload)
              setMessages((prev) => {
              const exists = prev.some((m) => m.id === payload.new.id)
              return exists ? prev : [...prev, payload.new]
              })
              // scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          )
          .subscribe((status) => {
            console.log("📡 Estado canal:", status)
          })

      channelRef.current = channel

      return () => {  
          console.log("🧹 Cerrando canal:", roomId)
          supabase.removeChannel(channel)
          channelRef.current = null
      }}
      setupRealtime()
  }, [roomId])

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="border rounded p-4 flex flex-col h-[70vh]">
      <div className="flex-1 overflow-auto space-y-2 mb-4">
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            username={profilesMap[m.user_id] ?? m.user_id}
          />
        ))}
        <div ref={scrollRef} />
      </div>

      <ChatInput supabase={supabase} roomId={roomId} user={user} />
    </div>
  )
}
