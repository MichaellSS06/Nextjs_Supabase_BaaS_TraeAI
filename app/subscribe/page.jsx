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
      const { data, error } = await supabase.functions.invoke("products", {method: "GET"})
      //const res = await fetch("/api/paddle/plans") //edge function
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      console.log("Productos recibidos:", data);
      setProducts(data??[])
    }
    fetchProducts()
  }, [])

  const handleCheckout = async (priceId) => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log(priceId, user.id)

      const { data, error } = await supabase.functions.invoke("checkout_hosted", {
        method: "POST",
        body: { priceId, userId: user.id },
      })

      if (error) {
        console.error(error)
        alert("Error al iniciar el checkout")
        return
      }

      console.log(data)
      const { url } = data

      if (url) {
        console.log("Checkout URL:", url)
        window.location.href = url // ✅ Reactiva si ya quieres probar el redireccionamiento
      } else {
        alert("Error en la url de checkout")
      }
    } catch (err) {
      console.error("Error en handleCheckout:", err)
      alert("Ocurrió un error inesperado")
    } finally {
      // 🔁 Siempre vuelve a habilitar el botón
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-3xl font-bold">Elige tu plan</h1>

      {products.map((p) => (
        <div key={p.id} className="p-6 border rounded-lg w-80 text-center">
          <h2 className="text-xl font-semibold">{p.name}</h2>
          <p className="text-gray-500 mb-2">{p.description}</p>
          {p.prices && p.prices.map((price)=>(
            <div key={price.id} className="text-2xl font-bold mb-4">
              <h2 className="text-lg font-medium mb-2">
                {price.name}
              </h2>
              <h2 className="text-2xl font-bold mb-4">
                {price.unit_price/100} {price.currency}
              </h2>
              <button
                onClick={() => handleCheckout(price.id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Suscribirme
              </button>
            </div>
          ))}
          
        </div>
      ))}
    </div>
  )
}
