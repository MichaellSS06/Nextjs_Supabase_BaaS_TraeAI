"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ButtonCancelSub({userId}) {
    const supabase = createClientComponentClient()
    const handleCancelSubscription = async () => {
        const { data, error } = await supabase.functions.invoke("cancelarsub", {
            body: { userId: userId },
        })

        if (error) {
            console.error(error)
            alert("Error al cancelar la suscripción")
            return
        }

        alert("Tu suscripción fue cancelada correctamente ✅")
        console.log("Paddle cancel response:", data)
    }

    return (
        <button
            onClick={handleCancelSubscription}
            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            >
            Cancelar suscripción
        </button>
    )
}