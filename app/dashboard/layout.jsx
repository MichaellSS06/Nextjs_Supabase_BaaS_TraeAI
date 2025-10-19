import { createServerClient } from "@/lib/supabaseClient"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 1. Verificar suscripción
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (new Date(subscription?.expires_at) > new Date()) {
    return <>{children}</>
  }

  // 2. Si no tiene suscripción, revisar trial (30 días desde la creación del user)
  const createdAt = new Date(user.created_at)
  const now = new Date()
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24)

  if (diffDays <= 30) {
    return <>{children}</>
  }

  // 3. Si no hay trial ni suscripción activa → redirigir
  redirect("/subscribe")
}