import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-16 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PF-FgdJMlTBze74Y6mdKI0AT4NeIf8X7s.png"
                alt="Purple Fit Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>We've sent you a confirmation link to complete your registration.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Please check your email and click the confirmation link to activate your account.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
