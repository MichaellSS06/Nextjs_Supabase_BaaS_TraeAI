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
    <div className="mt-15 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-indigo-800"
          >
            Crea tu cuenta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-2"
          >
            Comienza tu viaje fitness hoy mismo
          </motion.p>
        </div>

        <motion.form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white p-8 rounded-2xl shadow-lg space-y-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="username"
                {...register("username")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {errors.username && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••"
                {...register("password")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-md transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            ) : "Crear cuenta"}
          </motion.button>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Inicia sesión
              </a>
            </p>
          </div>
        </motion.form>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">o continúa con</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <OAuthButtons />
        </motion.div>
      </motion.div>
    </div>
  )
}
