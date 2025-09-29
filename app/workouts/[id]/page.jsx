import ButtonWorkout from "@/components/ButtonWorkout"
import { createServerClient } from "@/lib/supabaseClient"

export default async function WorkoutDetailPage({params}) {
  const supabase = await createServerClient()
  const { id } = await params
  console.log(id)
  // Traer workout con sus ejercicios
  const { data, error } = await supabase
    .from("workout_exercises")
    .select(`
      sets, reps, rest,
      exercises ( name, category, video_url, description )
    `)
    .eq("workout_id", id)

  if (error) return <p>Error cargando</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Entrenamiento</h2>
      <ul className="space-y-4">
        {data.map((item, i) => (
          <li key={i} className="border rounded-lg p-4 bg-white shadow">
            <h4 className="font-semibold">{item.exercises.name}</h4>
            <p className="text-sm text-gray-600">{item.exercises.description}</p>
            <p className="text-sm">Sets: {item.sets} | Reps: {item.reps} | Descanso: {item.rest}s</p>
            {item.exercises.video_url && (
              <a
                href={item.exercises.video_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline text-sm"
              >
                Ver video
              </a>
            )}
          </li>
        ))}
      </ul>
      <ButtonWorkout id={id} />
    </div>
  )
}
