import { createServerClient } from "@/lib/supabaseClient"
import LogoutButton from "@/components/LogoutButton"
import Link from "next/link"
import { HydrateUser } from "@/components/HydratedUser"

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold text-center">Dashboard</h2>
      {user && <p className="mt-2">Hola, {user.user_metadata.username||user.user_metadata.name.split(" ")[0]}</p>}
      <LogoutButton />

      <Link href="/dashboard/profilesetup" className="hover:text-blue-400 transition">Configurar perfil</Link>
      <HydrateUser user={user} />
    </div>
  )
}