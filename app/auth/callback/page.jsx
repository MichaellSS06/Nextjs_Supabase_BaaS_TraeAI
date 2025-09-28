"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error en la autenticación:", error.message)
        router.push("/login")
        return
      }

      if (session?.user) {
      // Verificar si el perfil ya existe
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single()

      if (!existingProfile) {
        await supabase.from("profiles").insert([
          {
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email.split("@")[0],
            full_name: "",
            age: null,
            height: null,
            weight: null,
            goal: null,
            preferences: {}
          }
        ])
      }

        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg animate-pulse">
        <h2 className="text-xl font-bold text-center">Procesando autenticación...</h2>
        <p className="text-center mt-2">Por favor espera un momento</p>
      </div>
    </div>
  )
}
