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
    <div className="border border-gray-200 rounded-xl shadow-sm bg-white p-4 flex flex-col min-h-screen">
      <div className="flex-1 overflow-auto space-y-3 mb-4 p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              username={profilesMap[m.user_id] ?? m.user_id}
              supabase={supabase}
          />
        )))}
        <div ref={scrollRef} />
      </div>

      <div className="sticky bottom-0 p-2">
        <ChatInput supabase={supabase} roomId={roomId} user={user} />
      </div> 
    </div>
  )
}
