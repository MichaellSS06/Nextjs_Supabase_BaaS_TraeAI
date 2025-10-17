import { createServerClient } from "@/lib/supabaseClient"
import LogoutButton from "@/components/LogoutButton"
import Link from "next/link"
import { HydrateUser } from "@/components/HydratedUser"
import WorkoutCard from "@/components/WorkoutCard"
import ActiveWorkoutDisplay from "./ActiveWorkoutDisplay"
import ChatSelector from "@/components/ChatSelector"
import ButtonCancelSub from "@/components/ButtonCancelSub"

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log(user.user_metadata.avatar_url)
  console.log(user.id)

  // Obtener entrenamientos generales o creados por el sistema
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error(error)
    return <p>Error cargando entrenamientos</p>
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold text-center">Dashboard</h2>
      {user && <p className="mt-2">Hola, {user.user_metadata.username||user.user_metadata.name.split(" ")[0]}</p>}
      {user && <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />}
      
      <LogoutButton />

      <ButtonCancelSub userId={user.id}/>


      <Link href="/dashboard/profilesetup" className="hover:text-blue-400 transition">Configurar perfil</Link>
      <HydrateUser user={user} />

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts?.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
      
      <ActiveWorkoutDisplay user={user} />

      <ChatSelector />

      <Link href="/progress" className="hover:text-blue-400 transition p-10">Progress Page</Link>
      <Link href="/workouts/history" className="hover:text-blue-400 transition p-10">Workout History Page</Link>
    </div>
  )
}