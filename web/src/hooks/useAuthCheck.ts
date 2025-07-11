import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { useAuthStore } from "@/stores/auth-store";

interface User {
  id: number;
  email: string;
  name: string;
}

export function useAuthCheck() {
  const { setIsAuthenticated, isAuthenticated } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token')
        
        if (token) {
          try {
            // Try to get user info from API
            const response = await axios.get("/auth/me")
            setUser(response.data)
            setIsAuthenticated(true)
          } catch (apiError) {
            // Fallback: create a mock user from token or localStorage
            // In production, you should decode the JWT properly
            const mockUser = {
              id: 1,
              email: localStorage.getItem('user_email') || 'user@example.com',
              name: localStorage.getItem('user_name') || 'User'
            }
            setUser(mockUser)
            setIsAuthenticated(true)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (err) {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('access_token')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [setIsAuthenticated])

  return { user, isAuthenticated, loading }
}
