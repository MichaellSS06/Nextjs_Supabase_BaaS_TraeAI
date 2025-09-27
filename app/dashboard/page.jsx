"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push("/login")
}
  
  return (
    <div className="flex gap-10 items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-xl font-bold text-center">dashboard</h2>
        {user && <p className="mt-2">Hola, {user.email}</p>}
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Cerrar sesión
        </button>
    </div>
  )
}