'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error("Sign in error:", signInError)
      setError(signInError.message)
      setIsSubmitting(false)
      return
    }

    // On successful login, Supabase handles the session/cookie via middleware
    // Refresh the page to update layout state, then redirect
    router.refresh()
    router.push('/') // Redirect to home page after login
  }

  // Optional: Add a sign-up handler if needed
  const handleSignUp = async () => {
      setError(null)
      setMessage(null)
      setIsSubmitting(true)

      const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
              // emailRedirectTo: 'http://localhost:3000/auth/callback', // Optional: For email confirmation
          },
      });

      if (signUpError) {
          console.error("Sign up error:", signUpError)
          setError(signUpError.message);
          setIsSubmitting(false);
          return;
      }
      
      // You might want email confirmation enabled in Supabase settings
      setMessage("Check your email for a confirmation link to sign in.");
      setIsSubmitting(false);
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-sm px-8 justify-center gap-2">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground"
        onSubmit={handleSignIn}
      >
        <h1 className="text-2xl font-bold mb-4">Sign In / Sign Up</h1>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
        <Button type="button" variant="outline" onClick={handleSignUp} disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
        {error && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {error}
          </p>
        )}
        {message && (
           <p className="mt-4 p-4 bg-green-100 text-green-700 text-center">
             {message}
            </p>
        )}
      </form>
    </div>
  )
} 