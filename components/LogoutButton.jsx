"use client"

import { useUserStore } from "@/lib/userStore"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const profile = useUserStore((state) => state.profile)

  const handleLogout = async () => {
    localStorage.removeItem("workout-storage")
    localStorage.removeItem("user-storage")
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {profile?.age && <p className="mt-2">Edad: {profile.age}</p>}
      {profile?.height && <p className="mt-2">Altura: {profile.height}</p>}
      {profile?.weight && <p className="mt-2">Peso: {profile.weight}</p>}
      {profile?.goal && <p className="mt-2">Objetivo: {profile.goal}</p>}
      {profile?.avatar_url && 
        <img 
          src={profile.avatar_url} 
          alt="Avatar" 
          className="w-12 h-12 rounded-full object-cover" 
        />
      }

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
