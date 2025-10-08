"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => router.push("/dashboard"), 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold text-green-600">
        ¡Suscripción exitosa! 🎉
      </h1>
      <p>Redirigiendo al dashboard...</p>
    </div>
  )
}
