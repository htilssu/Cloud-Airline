import axiosInstance from '../lib/axios'

export interface Airport {
  id: string
  name: string
  city: string
  display: string
}

export const airportApi = {
  // Lấy tất cả sân bay
  getAll: async (): Promise<Airport[]> => {
    const response = await axiosInstance.get('/airports')
    return response.data
  },

  // Tìm kiếm sân bay
  search: async (query: string): Promise<Airport[]> => {
    const response = await axiosInstance.get(`/airports/search?q=${encodeURIComponent(query)}`)
    return response.data
  }
}
