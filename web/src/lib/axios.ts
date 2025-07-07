// src/lib/axios.ts

import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
})

export default instance
