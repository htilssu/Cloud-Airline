// src/lib/validators/auth.ts
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
export const signUpSchema=z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name:z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().length(12, "Phone number must be valid"),
})
export type SignInSchema = z.infer<typeof signInSchema>
export type SignUpSchema=z.infer<typeof signUpSchema>