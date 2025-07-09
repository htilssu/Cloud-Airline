import { useEffect } from "react"
import axios from "@/lib/axios"
import { useAuthStore } from "@/stores/auth-store";

export function useAuthCheck() {
  const { setIsAuthenticated } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // NOT YET
        await axios.get("/api/check-auth")
        setIsAuthenticated(true)
      } catch (error) {
        if(error instanceof Error) {
          setIsAuthenticated(false)
          throw error
        }
      }
    }
    checkAuth()
  }, [setIsAuthenticated])
}
