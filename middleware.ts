import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware' // Adjust this path if it's different in your project

export async function middleware(request: NextRequest) {
  // This function runs for every matched request to handle authentication.
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Anything with a file extension (e.g., .svg, .png, .jpg, .json, etc.)
     * This is the crucial part that will unblock your logo, cover image, manifest, AND icons.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
