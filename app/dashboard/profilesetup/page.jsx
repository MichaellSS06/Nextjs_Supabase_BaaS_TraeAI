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
  const [avatarFile, setAvatarFile] = useState(null) // para manejar el archivo de imagen

  const [form, setForm] = useState({
    full_name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    equipment: [],
    preferences: { time_per_week: "", injuries: "" },
    avatar_url: "", // 👈 añadimos avatar_url
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("Debes iniciar sesión primero")
      return
    }

    let avatar_url = form.avatar_url

    // 👇 Subir avatar si hay archivo nuevo
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars") // 👈 bucket "avatars" en Storage
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
        console.error(uploadError)
        toast.error("Error subiendo avatar")
        return
      }

      // Obtener URL pública
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      avatar_url = data.publicUrl
    }

    // 👇 Guardar perfil

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      age: form.age ? parseInt(form.age) : null,
      height: form.height ? parseFloat(form.height) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      goal: form.goal,
      equipment: form.equipment,
      preferences: form.preferences,
      avatar_url, // 👈 guardamos avatar_url
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
    <div className="mt-15 max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Configura tu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

         {/* Avatar */}
        <div>
          <label className="block font-medium">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full"
          />
          {form.avatar_url && (
            <img
              src={form.avatar_url}
              alt="Avatar actual"
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          )}
        </div>

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
