"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUserStore } from "@/lib/userStore"

export default function NewProgressPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const user = useUserStore((state) => state.user)

  const [form, setForm] = useState({
    weight: "",
    fat_percentage: "",
    chest: "",
    waist: "",
    hips: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // insertar progress
      const { error: insertError } = await supabase.from("progress").insert({
        user_id: user.id,
        weight: form.weight || null,
        fat_percentage: form.fat_percentage || null,
        chest: form.chest || null,
        waist: form.waist || null,
        hips: form.hips || null,
      })

      if (insertError) throw insertError

      setSuccess("Registro guardado correctamente 🎉")
      setForm({
        weight: "",
        fat_percentage: "",
        chest: "",
        waist: "",
        hips: "",
      })

      // opcional: redirigir a historial
      router.push("/progress")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-15 max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Registrar Progreso</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">% Grasa</label>
          <input
            type="number"
            step="0.1"
            name="fat_percentage"
            value={form.fat_percentage}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pecho (cm)</label>
          <input
            type="number"
            step="0.1"
            name="chest"
            value={form.chest}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cintura (cm)</label>
          <input
            type="number"
            step="0.1"
            name="waist"
            value={form.waist}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cadera (cm)</label>
          <input
            type="number"
            step="0.1"
            name="hips"
            value={form.hips}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  )
}
