"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/lib/userStore"

export default function ProfileSetupPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const profile = useUserStore((state) => state.profile)

  const [form, setForm] = useState({
    full_name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    equipment: [],
    preferences: { time_per_week: "", injuries: "" },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target
    setForm((prev) => {
      let updated = [...prev.equipment]
      if (checked) {
        updated.push(value)
      } else {
        updated = updated.filter((item) => item !== value)
      }
      return { ...prev, equipment: updated }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("Debes iniciar sesión primero")
      return
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      age: form.age ? parseInt(form.age) : null,
      height: form.height ? parseFloat(form.height) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      goal: form.goal,
      equipment: form.equipment,
      preferences: form.preferences,
    })

    if (error) {
      console.error(error)
      toast.error("Error guardando el perfil")
    } else {
      toast.success("Perfil actualizado")
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Configura tu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre completo</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Edad</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Altura (cm)</label>
            <input
              type="number"
              step="0.01"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Peso (kg)</label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Objetivo</label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecciona uno</option>
            <option value="bajar peso">Bajar peso</option>
            <option value="ganar masa">Ganar masa</option>
            <option value="rendimiento">Rendimiento</option>
            <option value="salud">Salud</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Equipo disponible</label>
          <div className="flex gap-4">
            {["Mancuernas", "Cuerda", "Banda", "Barra"].map((eq) => (
              <label key={eq} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={eq}
                  checked={form.equipment.includes(eq)}
                  onChange={handleEquipmentChange}
                />
                {eq}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium">Tiempo disponible (hrs/semana)</label>
          <input
            type="text"
            value={form.preferences.time_per_week}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, time_per_week: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Lesiones / Restricciones</label>
          <input
            type="text"
            value={form.preferences.injuries}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, injuries: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  )
}
