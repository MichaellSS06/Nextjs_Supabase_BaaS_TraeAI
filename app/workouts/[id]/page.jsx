import ButtonWorkout from "@/components/ButtonWorkout"
import { createServerClient } from "@/lib/supabaseClient"
import Link from "next/link"

export default async function WorkoutDetailPage({params}) {
  const supabase = await createServerClient()
  const { id } = await params
  
  // Traer workout con sus ejercicios
  const { data: exercises, error: exercisesError } = await supabase
    .from("workout_exercises")
    .select(`
      sets, reps, rest,
      exercises ( name, category, video_url, description )
    `)
    .eq("workout_id", id)

  // Traer información del workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", id)
    .single()

  if (exercisesError || workoutError) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el entrenamiento</h2>
          <p className="text-gray-600 mb-6">No pudimos encontrar la información solicitada.</p>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4 text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">{workout?.name || "Entrenamiento"}</h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            {workout?.difficulty && (
              <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {workout.difficulty}
              </span>
            )}
            {workout?.type && (
              <span className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                {workout.type}
              </span>
            )}
            {workout?.duration && (
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {workout.duration} min
              </span>
            )}
          </div>
          
          {workout?.description && (
            <p className="text-gray-700 mb-4">{workout.description}</p>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Ejercicios
        </h3>
        
        <ul className="space-y-4 mb-8">
          {exercises.map((item, i) => (
            <li key={i} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg text-gray-800">{item.exercises.name}</h4>
                {item.exercises.category && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {item.exercises.category}
                  </span>
                )}
              </div>
              
              {item.exercises.description && (
                <p className="text-gray-600 mb-3">{item.exercises.description}</p>
              )}
              
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {item.sets} series
                </span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {item.reps} repeticiones
                </span>
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {item.rest}s descanso
                </span>
              </div>
              
              {item.exercises.video_url && (
                <a
                  href={item.exercises.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ver video demostrativo
                </a>
              )}
            </li>
          ))}
        </ul>
        
        <div className="sticky bottom-4 bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
          <ButtonWorkout id={id} />
        </div>
      </div>
    </div>
  )
}
