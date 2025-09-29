"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogout = async () => {
    localStorage.removeItem("workout-storage")
    localStorage.removeItem("user-storage")
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg"
    >
      Cerrar sesión
    </button>
  )
}
