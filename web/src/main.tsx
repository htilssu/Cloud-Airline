import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "@/App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
    <App />
    </QueryClientProvider>
  </React.StrictMode>,
)