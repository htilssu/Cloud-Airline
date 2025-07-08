import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "@/App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "sonner";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
    <App />
    </QueryClientProvider>
  </React.StrictMode>,
)