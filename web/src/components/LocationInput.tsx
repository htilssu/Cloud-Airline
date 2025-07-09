import React, { useState, useEffect, useRef } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import { Airport, airportApi } from '../apis/airports'

interface LocationInputProps {
  value: string
  onChange: (value: string, airport?: Airport) => void
  placeholder: string
  label: string
  className?: string
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [airports, setAirports] = useState<Airport[]>([])
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load all airports on component mount
  useEffect(() => {
    const loadAirports = async () => {
      try {
        setLoading(true)
        const allAirports = await airportApi.getAll()
        setAirports(allAirports)
        setFilteredAirports(allAirports)
      } catch (error) {
        console.error('Failed to load airports:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAirports()
  }, [])

  // Filter airports based on input value
  useEffect(() => {
    if (!value.trim()) {
      setFilteredAirports(airports)
      return
    }

    const filtered = airports.filter(airport =>
      airport.city.toLowerCase().includes(value.toLowerCase()) ||
      airport.name.toLowerCase().includes(value.toLowerCase()) ||
      airport.id.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredAirports(filtered)
  }, [value, airports])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  const handleAirportSelect = (airport: Airport) => {
    onChange(airport.display, airport)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`pl-10 pr-10 h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none ${className}`}
          autoComplete="off"
        />
        <ChevronDown 
          className={`absolute right-3 top-3 h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
        
        {/* Dropdown */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                Đang tải...
              </div>
            ) : filteredAirports.length > 0 ? (
              <div className="py-1">
                {filteredAirports.map((airport) => (
                  <button
                    key={airport.id}
                    onClick={() => handleAirportSelect(airport)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{airport.city}</div>
                    <div className="text-sm text-gray-500">
                      {airport.id} - {airport.name}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-gray-500">
                Không tìm thấy sân bay nào
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationInput
