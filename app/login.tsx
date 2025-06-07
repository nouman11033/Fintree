"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    // Mock login logic
    setTimeout(() => {
      setLoading(false)
      if (email === "demo@fintree.com" && password === "password") {
        window.location.href = "/"
      } else {
        setError("Invalid credentials. Try demo@fintree.com / password")
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Card className="w-full max-w-md bg-black border-white/20">
        <CardHeader>
          <div className="flex flex-col items-center">
            <Avatar className="w-14 h-14 mb-2">
              <AvatarFallback className="bg-white text-black font-semibold text-2xl">FT</AvatarFallback>
            </Avatar>
            <CardTitle className="text-center text-white">Sign in to FinTree LMS</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="demo@fintree.com"
                className="bg-black border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="password"
                className="bg-black border-white/20 text-white"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 