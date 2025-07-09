import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import UIDatePicker from '../components/ui/datepicker'
import { Calendar, MapPin, Plane, Users, ArrowRightLeft, Menu, X } from 'lucide-react'
import LocationInput from '../components/LocationInput'
import { Airport } from '../apis/airports'

const HomePage = () => {
  const navigate = useNavigate()
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [fromAirport, setFromAirport] = useState<Airport | null>(null)
  const [toAirport, setToAirport] = useState<Airport | null>(null)
  const [departDate, setDepartDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [tripType, setTripType] = useState('roundtrip')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSwapLocations = () => {
    const tempLocation = fromLocation
    const tempAirport = fromAirport
    setFromLocation(toLocation)
    setFromAirport(toAirport)
    setToLocation(tempLocation)
    setToAirport(tempAirport)
  }

  const handleFromLocationChange = (value: string, airport?: Airport) => {
    setFromLocation(value)
    setFromAirport(airport || null)
  }

  const handleToLocationChange = (value: string, airport?: Airport) => {
    setToLocation(value)
    setToAirport(airport || null)
  }

  const handleSearch = () => {
    // Chuyển hướng sang trang danh sách chuyến bay, truyền các tham số lọc qua query string
    const params = new URLSearchParams({
      from: fromAirport?.id || fromLocation || '',
      to: toAirport?.id || toLocation || '',
      date: departDate ? departDate.toISOString().split('T')[0] : '',
      passengers: String(passengers),
      tripType,
      sort_price: '', // giữ đồng bộ với filter trang danh sách chuyến bay
    });
    navigate(`/flights?${params.toString()}`);
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false) // Đóng mobile menu khi navigate
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation('/')}>
              <Plane className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Cloud Airline</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavigation('/')} 
                className="text-white/90 hover:text-white transition-colors"
              >
                Trang chủ
              </button>
              <button 
                onClick={() => handleNavigation('/flights')} 
                className="text-white/90 hover:text-white transition-colors"
              >
                Chuyến bay
              </button>
              <button 
                onClick={() => handleNavigation('/promotions')} 
                className="text-white/90 hover:text-white transition-colors"
              >
                Khuyến mãi
              </button>
              <button 
                onClick={() => handleNavigation('/contact')} 
                className="text-white/90 hover:text-white transition-colors"
              >
                Liên hệ
              </button>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10"
                onClick={() => handleNavigation('/auth/sign-in')}
              >
                Đăng nhập
              </Button>
              <Button 
                className="bg-white text-blue-700 hover:bg-white/90"
                onClick={() => handleNavigation('/auth/sign-up')}
              >
                Đăng ký
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => handleNavigation('/')} 
                  className="text-white/90 hover:text-white transition-colors text-left"
                >
                  Trang chủ
                </button>
                <button 
                  onClick={() => handleNavigation('/flights')} 
                  className="text-white/90 hover:text-white transition-colors text-left"
                >
                  Chuyến bay
                </button>
                <button 
                  onClick={() => handleNavigation('/promotions')} 
                  className="text-white/90 hover:text-white transition-colors text-left"
                >
                  Khuyến mãi
                </button>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="text-white/90 hover:text-white transition-colors text-left"
                >
                  Liên hệ
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  <Button 
                    variant="outline" 
                    className="text-white border-white/30 hover:bg-white/10 w-full"
                    onClick={() => handleNavigation('/auth/sign-in')}
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    className="bg-white text-blue-700 hover:bg-white/90 w-full"
                    onClick={() => handleNavigation('/auth/sign-up')}
                  >
                    Đăng ký
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Khám phá thế giới
              <span className="block text-blue-200">cùng Cloud Airline</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Đặt vé máy bay dễ dàng với giá tốt nhất. Hơn 1000 điểm đến trên toàn thế giới đang chờ bạn khám phá.
            </p>
          </div>

          {/* Flight Search Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            {/* Trip Type Selector */}
            <div className="flex space-x-6 mb-8">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="roundtrip"
                  checked={tripType === 'roundtrip'}
                  onChange={(e) => setTripType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-gray-700 font-medium">Khứ hồi</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="oneway"
                  checked={tripType === 'oneway'}
                  onChange={(e) => setTripType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-gray-700 font-medium">Một chiều</span>
              </label>
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* From Location */}
              <LocationInput
                value={fromLocation}
                onChange={handleFromLocationChange}
                placeholder="Thành phố hoặc sân bay"
                label="Điểm khởi hành"
              />

              {/* Swap Button */}
              <div className="flex justify-center items-end pb-3 lg:pb-0 lg:items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapLocations}
                  className="rounded-full p-2 h-10 w-10 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* To Location */}
              <div className="lg:-ml-14">
                <LocationInput
                  value={toLocation}
                  onChange={handleToLocationChange}
                  placeholder="Thành phố hoặc sân bay"
                  label="Điểm đến"
                />
              </div>

              {/* Passengers */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hành khách
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="pl-10 h-12 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white"
                  >
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'người' : 'người'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày đi
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  <UIDatePicker
                    selected={departDate}
                    onChange={(date) => {
                      setDepartDate(date)
                      if (returnDate && date && returnDate < date) setReturnDate(null)
                    }}
                    minDate={new Date()}
                    placeholder="Chọn ngày đi"
                    className="pl-10"
                  />
                </div>
              </div>

              {tripType === 'roundtrip' && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày về
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <UIDatePicker
                      selected={returnDate}
                      onChange={setReturnDate}
                      minDate={departDate || new Date()}
                      placeholder="Chọn ngày về"
                      disabled={!departDate}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="text-center">
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Tìm chuyến bay
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">Tại sao chọn Cloud Airline?</h3>
            <p className="text-blue-100 text-lg">Những ưu điểm vượt trội của chúng tôi</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Giá tốt nhất</h4>
              <p className="text-blue-100">Cam kết giá vé máy bay tốt nhất thị trường với nhiều ưu đãi hấp dẫn</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Đa dạng điểm đến</h4>
              <p className="text-blue-100">Hơn 1000 điểm đến trên toàn thế giới, từ các thành phố lớn đến thiên đường du lịch</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Dịch vụ tận tâm</h4>
              <p className="text-blue-100">Đội ngũ hỗ trợ khách hàng 24/7, sẵn sàng giải đáp mọi thắc mắc của bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Plane className="h-6 w-6" />
                <h5 className="text-lg font-bold">Cloud Airline</h5>
              </div>
              <p className="text-gray-400">
                Hãng hàng không hàng đầu với dịch vụ chất lượng cao và giá cả phải chăng.
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Dịch vụ</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Đặt vé máy bay</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Check-in online</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quản lý đặt chỗ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hành lý</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Hỗ trợ</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách hoàn tiền</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Về chúng tôi</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tin tức</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Đối tác</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Cloud Airline. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
