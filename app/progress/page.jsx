"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { useUserStore } from "@/lib/userStore"
import Link from "next/link"

export default function ProgressPage() {
  const supabase = createClientComponentClient()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore((state) => state.user)
    console.log(user)
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true)
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: true })

      if (!error && data) setProgress(data)
      setLoading(false)
    }

    fetchProgress()
  }, [user])

  if (loading) return <p className="flex items-center justify-center p-6 text-gray-600">Cargando progreso...</p>

  const latest = progress[progress.length - 1] || {}
  const prev = progress[progress.length - 2] || {}
  const weightDiff = latest.weight && prev.weight ? (latest.weight - prev.weight).toFixed(1) : null

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 ">
        <div className="flex items-center justify-center">
            <Link href="/progress/new" className="hover:text-blue-400 transition p-4 text-center font-medium">Nuevo progreso</Link>
            <Link href="/dashboard" className="hover:text-blue-400 transition p-4 text-center font-medium">Dashboard</Link>
        </div>
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Mi Progreso
      </motion.h1>

      {/* Tarjetas resumen */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-sm">Peso actual</p>
          <p className="text-2xl font-bold text-blue-600">{latest.weight || "–"} kg</p>
          {weightDiff && (
            <p className={`text-sm ${weightDiff < 0 ? "text-green-600" : "text-red-600"}`}>
              {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg desde la última vez
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-sm">% de grasa</p>
          <p className="text-2xl font-bold text-purple-600">{latest.fat_percentage || "–"}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-sm">Cintura</p>
          <p className="text-2xl font-bold text-orange-500">{latest.waist || "–"} cm</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-sm">Pecho</p>
          <p className="text-2xl font-bold text-green-600">{latest.chest || "–"} cm</p>
        </div>
      </motion.div>

      {/* Tabla de métricas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto bg-white rounded-xl shadow"
      >
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3">Peso (kg)</th>
              <th className="p-3">% Grasa</th>
              <th className="p-3">Pecho (cm)</th>
              <th className="p-3">Cintura (cm)</th>
              <th className="p-3">Cadera (cm)</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p, i) => (
              <tr
                key={p.id}
                className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-3">{new Date(p.recorded_at).toLocaleDateString()}</td>
                <td className="p-3 text-center">{p.weight}</td>
                <td className="p-3 text-center">{p.fat_percentage}</td>
                <td className="p-3 text-center">{p.chest}</td>
                <td className="p-3 text-center">{p.waist}</td>
                <td className="p-3 text-center">{p.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Gráfica de evolución */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Evolución</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={progress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="recorded_at"
              tickFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <Legend />

            {/* Peso */}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
            {/* Cintura */}
            <Line
              type="monotone"
              dataKey="waist"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              animationDuration={1200}
            />
            {/* Pecho */}
            <Line
              type="monotone"
              dataKey="chest"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              animationDuration={1400}
            />
            {/* Cadera */}
            <Line
              type="monotone"
              dataKey="hips"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              animationDuration={1600}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
