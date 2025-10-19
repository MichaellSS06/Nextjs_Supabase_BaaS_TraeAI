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
  console.log(user.id)

  // Obtener entrenamientos generales o creados por el sistema
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error(error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-500 font-medium">Error cargando entrenamientos</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              {user && user.user_metadata.avatar_url && (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm" 
                />
              )}
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  Hola, {user && (user.user_metadata.username || (user.user_metadata.name && user.user_metadata.name.split(" ")[0]) || 'Usuario')}
                </h1>
                <p className="text-gray-500">Bienvenido a tu dashboard de entrenamiento</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/dashboard/profilesetup" 
                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>

      <div className="flex justify-center items-center mb-10">
        <ButtonCancelSub userId={user.id}/>
      </div>


        <HydrateUser user={user} />
        
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Entrenamientos disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts?.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </div>
        
        <div className="mb-8 justify-center flex items-center">
          <ActiveWorkoutDisplay user={user} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Chats</h2>
          <div className="bg-white rounded-xl shadow-md p-4">
            <ChatSelector />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Link 
            href="/progress" 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Tu progreso</h3>
              <p className="text-sm text-gray-500">Ver estadísticas y avances</p>
            </div>
          </Link>
          
          <Link 
            href="/workouts/history" 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Historial</h3>
              <p className="text-sm text-gray-500">Ver entrenamientos anteriores</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}