"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMutation } from "@apollo/client"
import { CREATE_USER } from "@/graphql/mutations"
import { setAuthToken, setUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  
  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      console.log("🚀 [REGISTER] onCompleted called")
      console.log("📊 [REGISTER] data:", data)
      
      if (data.insert_users_one) {
        const user = data.insert_users_one
        console.log("✅ [REGISTER] User created:", user)
        
        // เก็บข้อมูล user
        setAuthToken("mock-token-" + user.id)
        setUser({
          id: user.id,
          email: user.email,
          name: user.name
        })
        
        toast({
          title: "Success",
          description: "Account created successfully",
        })
        router.push("/tasks")
      }
    },
    onError: (error) => {
      console.log("❌ [REGISTER] onError called")
      console.log("📋 [REGISTER] error:", error)
      console.log("📋 [REGISTER] error.message:", error.message)
      console.log("📋 [REGISTER] error.graphQLErrors:", error.graphQLErrors)
      console.log("📋 [REGISTER] error.networkError:", error.networkError)
      
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("🚀 [REGISTER] Form submitted")
    console.log("📧 Email:", email)
    console.log("👤 Name:", name)
    console.log("🔒 Password:", password ? "***" : "(empty)")
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    console.log("➕ [REGISTER] Calling CREATE_USER mutation...")
    console.log("📝 [REGISTER] Variables:", { 
      name, 
      email: email.toLowerCase(), 
      password_hash: "mock_password_not_used"
    })
    
    await createUser({ 
      variables: { 
        name, 
        email: email.toLowerCase(), 
        password_hash: password, // ส่ง password_hash ไปด้วย
      } 
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
