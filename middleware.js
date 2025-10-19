import { NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export const config = {
  matcher: ["/dashboard/:path*", "/workouts/:path*", "/profile/:path*", "/suscribe/:path*", "/progress/:path*"],
}

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rutas privadas
  const protectedRoutes = ["/dashboard", "/workouts", "/profile", "/suscribe", "/progress"]

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return res
}
