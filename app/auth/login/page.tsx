"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLazyQuery } from "@apollo/client"
import { LOGIN_USER } from "@/graphql/mutations"
import { setAuthToken, setUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [loginUser] = useLazyQuery(LOGIN_USER)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Query user จาก database
      const { data, error } = await loginUser({
        variables: { email: email.toLowerCase(), pass: password }
      })

      if (error) {
        throw error
      }

      if (!data?.users || data.users.length === 0) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      const user = data.users[0]

      // ในระบบจริงต้องเช็ค password ด้วย bcrypt
      // const isPasswordValid = await bcrypt.compare(password, user.password_hash)
      // แต่ตอนนี้ข้ามไปก่อน (mock authentication)

      setAuthToken("mock-token-" + user.id)
      setUser({
        id: user.id,
        email: user.email,
        name: user.name
      })

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      router.push("/tasks")

    } catch (error: any) {
      console.error("❌ [ERROR] Login failed:", error)
      console.error("📋 [ERROR] Details:", {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      })

      toast({
        title: "Error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Todo by Aemitez</CardTitle>
          <CardDescription className="text-center">Create a new account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
