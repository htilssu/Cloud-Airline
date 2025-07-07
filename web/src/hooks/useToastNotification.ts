"use client"

import { useCallback } from "react"
import { toast } from "sonner"

export function useToastNotifications() {
  const showSuccess = useCallback((message: string) => {
    toast.success(message)
  }, [])

  const showError = useCallback((message: string) => {
    toast.error(message)
  }, [])

  const showWarning = useCallback((message: string) => {
    toast.loading(message)
  }, [])

  return { showSuccess, showError, showWarning }
}
