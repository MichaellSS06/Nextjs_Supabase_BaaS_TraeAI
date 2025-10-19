"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"

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
        <motion.button
            onClick={handleCancelSubscription}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-md flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            Cancelar suscripción
        </motion.button>
    )
}