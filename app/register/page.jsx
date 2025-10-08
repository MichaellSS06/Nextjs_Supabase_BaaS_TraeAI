"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import OAuthButtons from "@/components/OAuthButtons"
import { motion } from "framer-motion";

const schema = z.object({
  email: z.email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  username: z.string().min(3, "Mínimo 3 caracteres")
})

export default function RegisterPage() {
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { username: data.username } // se guarda en metadata
        }
      })

      if (authError) throw authError

      // Crear perfil en la tabla profiles
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          username: data.username,
          full_name: "",
          age: null,
          height: null,
          weight: null,
          goal: null,
          preferences: {}
        }
      ])

      await supabase.from("subscriptions").insert([
        {
          user_id: authData.user.id,
          status: "canceled",
        }
      ])

      if (profileError) throw profileError

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
        className="bg-white p-8 rounded-xl shadow-lg w-80 space-y-4 transform transition-all duration-500 animate-slideUp hover:shadow-xl"
      >
        <h2 className="text-xl font-bold text-center mb-2 transform transition-all duration-500 animate-fadeInUp">Crear cuenta</h2>

        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

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

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Creando..." : "Registrarse"}
        </motion.button>
      </form>
       <div className="flex flex-col items-center justify-center mt-10">
          <span className="text-gray-400 text-sm">o continúa con</span>
          {/* OAuth Buttons */}
          <OAuthButtons/>
      </div>
    </div>
  )
}
