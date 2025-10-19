"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"

const providers = [
  { name: "Google", provider: "google", icon: "/google-icon.svg" },
  { name: "GitHub", provider: "github", icon: "/github-icon.svg" },
  { name: "Twitch", provider: "twitch", icon: "/twitch-icon.svg" },
  { name: "Azure", provider: "azure", icon: "/azure-icon.svg" },
  // Facebook si luego habilitas tu cuenta
]

export default function OAuthButtons() {
  const supabase = createClientComponentClient()
  const handleOAuthLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const buttonVariants = {
    initial: { scale: 1, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" },
    hover: { 
      scale: 1.02, 
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      {providers.map((p) => (
        <motion.button
          key={p.provider}
          onClick={() => handleOAuthLogin(p.provider)}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium shadow-sm"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {/* <img src={p.icon} alt={p.name} className="w-5 h-5" /> */}
          Continuar con {p.name}
        </motion.button>
      ))}
    </div>
  )
}
