import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Server Components
export const createServerClient = async() => {
  const cookieStore = await cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}
