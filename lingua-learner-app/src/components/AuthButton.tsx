'use client'

import { createClient } from '@/lib/supabase/client' // Import client-side utility
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button' // Assuming shadcn Button is available

interface AuthButtonProps {
  user: User | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter()
  const supabase = createClient() // Use the client-side creator

  const handleSignIn = async () => {
    // Using Supabase email/password for simplicity
    // You might replace this with OAuth or Magic Link later
    // For this example, we'll redirect to a dedicated login page
    router.push('/login')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh() // Refresh the page to update server session state
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <Button onClick={handleSignOut} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  ) : (
    <Button onClick={handleSignIn} variant="outline" size="sm">
      Login
    </Button>
  )
} 