import ChatContainer from "@/components/ChatContainer"
import { createServerClient } from "@/lib/supabaseClient"
import { getOrCreateWorkoutRoom } from "@/server/getOrCreateWorkoutRoom"

export default async function ChatPage({ params }) {
  const supabase = await createServerClient()
  const { workoutId } = await params

  // 1. Garantizar que la sala exista
  const room = await getOrCreateWorkoutRoom(workoutId)

  // 2. Mensajes iniciales
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, type, file_url, content, created_at, user_id, profiles(username)")
    .eq("room_id", room.id)
    .order("created_at", { ascending: true })

  return (
    <div className="mt-15 p-4">
      <h1 className="text-xl font-bold mb-4">Chat del Workout {workoutId}</h1>
      <ChatContainer roomId={room.id} initialMessages={messages ?? []} />
    </div>
  )
}
