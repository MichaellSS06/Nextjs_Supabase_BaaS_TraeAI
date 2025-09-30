// server/getOrCreateWorkoutRoom.js (server-side)
import { createServerClient } from "@/lib/supabaseClient"

export async function getOrCreateWorkoutRoom(workoutId) {
  const supabase = await createServerClient()

  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("type", "workout")
    .eq("workout_id", workoutId)
    .maybeSingle()

  if (existing) return existing

  const { data: newRoom } = await supabase
    .from("chat_rooms")
    .insert({ type: "workout", workout_id: workoutId })
    .select()
    .single()

  return newRoom
}
