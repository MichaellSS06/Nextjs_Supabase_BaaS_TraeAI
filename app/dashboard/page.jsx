import { createServerClient } from "@/lib/supabaseClient"
import LogoutButton from "@/components/LogoutButton"

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex gap-10 items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold text-center">Dashboard</h2>
      {user && <p className="mt-2">Hola, {user.user_metadata.username}</p>}
      <LogoutButton />
    </div>
  )
}
