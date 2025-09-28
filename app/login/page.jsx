"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const schema = z.object({
  email: z.email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (loginError) throw loginError

      router.push("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          {...register("email")}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {error && <p className="text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  )
}
