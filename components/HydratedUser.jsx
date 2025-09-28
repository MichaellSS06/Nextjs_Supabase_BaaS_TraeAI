"use client"
import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUserStore } from "@/lib/userStore"

export function HydrateUser({ user }) {
  const setUser = useUserStore((state) => state.setUser)
  const setProfile = useUserStore((state) => state.setProfile)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) setUser(user)
    
    const setupUser = async () => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

    if (profileError) {
          console.error("Error cargando profile:", profileError.message)
        } else {
          setProfile(profile)
        }
    }
    setupUser()
  }, [user, setUser, setProfile])

  return null
}
