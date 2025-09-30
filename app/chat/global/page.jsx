import ChatContainer from "@/components/ChatContainer"
import { createServerClient } from "@/lib/supabaseClient"

export default async function GlobalChatPage() {
  const supabase = await createServerClient()

  // 1. Obtener la sala global
  let { data: room } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("type", "global")
    .single()

  // 2. Mensajes iniciales
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, content, created_at, user_id, profiles(username)")
    .eq("room_id", room.id)
    .order("created_at", { ascending: true })

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat Global 🌍</h1>
      <ChatContainer roomId={room.id} initialMessages={messages ?? []} />
    </div>
  )
}
