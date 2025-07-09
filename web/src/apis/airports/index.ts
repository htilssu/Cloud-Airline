import axiosInstance from '../../lib/axios'

export interface Airport {
  id: string
  name: string
  city: string
  display: string
}

export const airportApi = {
  // Lấy tất cả sân bay
  getAllAirports: async (): Promise<Airport[]> => {
    try {
      const response = await axiosInstance.get('/airports')
      return response.data
    } catch (error) {
      console.error('Error fetching airports:', error)
      throw error
    }
  },

  // Tìm kiếm sân bay
  searchAirports: async (query: string): Promise<Airport[]> => {
    try {
      if (!query.trim()) {
        return []
      }
      const response = await axiosInstance.get(`/airports/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error searching airports:', error)
      throw error
    }
  }
}
