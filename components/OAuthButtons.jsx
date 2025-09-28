"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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

  return (
    <div className="flex flex-col gap-3 mt-6">
      {providers.map((p) => (
        <button
          key={p.provider}
          onClick={() => handleOAuthLogin(p.provider)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
        >
          {/* <img src={p.icon} alt={p.name} className="w-5 h-5" /> */}
          Continuar con {p.name}
        </button>
      ))}
    </div>
  )
}
