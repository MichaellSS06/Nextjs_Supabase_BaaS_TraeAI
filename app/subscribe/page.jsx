"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SubscribePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products") //edge function
      const data = await res.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const handleCheckout = async (priceId) => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const res = await fetch("/api/checkout", {//edge function
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, userId: user.id }),
    })
    const data = await res.json()
    router.push(data.url)
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-3xl font-bold">Elige tu plan</h1>

      {products.map((p) => (
        <div key={p.id} className="p-6 border rounded-lg w-80 text-center">
          <h2 className="text-xl font-semibold">{p.name}</h2>
          <p className="text-gray-500 mb-2">{p.interval}</p>
          <p className="text-2xl font-bold mb-4">
            ${p.price / 100} {p.currency.toUpperCase()}
          </p>
          <button
            onClick={() => handleCheckout(p.price_id)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Suscribirme
          </button>
        </div>
      ))}
    </div>
  )
}
