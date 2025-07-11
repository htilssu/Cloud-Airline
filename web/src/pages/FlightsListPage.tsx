import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  ArrowRight,
  Clock,
  Search,
  Repeat,
  ChevronDown,
} from 'lucide-react';
import UIDatePicker from '../components/ui/datepicker';
import axios from '../lib/axios';
import {
  flights,
  airports,
  searchFlights,
  flightsForListPage,
} from '../mock/Flights';
import { format } from 'date-fns';
import Header from '../components/Header';

interface Flight {
  id: string;
  flightNumber: string;
  departureAirport: { id: string; name: string; city: string };
  arrivalAirport: { id: string; name: string; city: string };
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  basePrice: number;
}

const PAGE_SIZE = 6;

const sortOptions = [
  { value: '', label: 'Sắp xếp' },
  { value: 'asc', label: 'Giá tăng dần' },
  { value: 'desc', label: 'Giá giảm dần' },
];

// Helper to generate 30-min interval times in 24h format
const timeOptions: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const FlightsListPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [departureLocation, setDepartureLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [departureDropdownOpen, setDepartureDropdownOpen] = useState(false);
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);

  // Refs for click outside
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const departureDropdownRef = useRef<HTMLDivElement>(null);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Sort dropdown
      if (
        sortDropdownOpen &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
      // Departure dropdown
      if (
        departureDropdownOpen &&
        departureDropdownRef.current &&
        !departureDropdownRef.current.contains(event.target as Node)
      ) {
        setDepartureDropdownOpen(false);
      }
      // Destination dropdown
      if (
        destinationDropdownOpen &&
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setDestinationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sortDropdownOpen, departureDropdownOpen, destinationDropdownOpen]);

  const totalPages = Math.ceil(flights.length / PAGE_SIZE);
  const pagedFlights = flights.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const fetchFlights = async (params: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      // const res = await axios.get('/flights', { params });
      // setFlights(res.data);
      let filteredFlights = flightsForListPage;

      // Filter by departure location
      if (departureLocation) {
        filteredFlights = filteredFlights.filter(
          (flight) => flight.departureAirport.id === departureLocation
        );
      }

      // Filter by destination
      if (destination) {
        filteredFlights = filteredFlights.filter(
          (flight) => flight.arrivalAirport.id === destination
        );
      }

      setFlights(filteredFlights);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (err: any) {
      setError('Không thể tải danh sách chuyến bay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Parse query params from URL and set initial filter state
    const params = new URLSearchParams(location.search);
    const date_from = params.get('date_from') || '';
    const date_to = params.get('date_to') || '';
    const departure = params.get('departure') || '';
    const dest = params.get('destination') || '';

    setDateFrom(date_from ? new Date(date_from) : null);
    setDateTo(date_to ? new Date(date_to) : null);
    setDepartureLocation(departure);
    setDestination(dest);

    fetchFlights({
      date_from: date_from || undefined,
      date_to: date_to || undefined,
      departure: departure || undefined,
      destination: dest || undefined,
    });
  }, [location.search]);

  // Sort flights in-place when sortPrice changes, do not refetch
  React.useEffect(() => {
    if (!sortPrice) return;
    setFlights((prev) => {
      const sorted = [...prev];
      if (sortPrice === 'asc') {
        sorted.sort((a, b) => a.basePrice - b.basePrice);
      } else if (sortPrice === 'desc') {
        sorted.sort((a, b) => b.basePrice - a.basePrice);
      }
      return sorted;
    });
    setCurrentPage(1); // Reset to first page on sort
  }, [sortPrice]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights({
      date_from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
      date_to: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined,
      departure: departureLocation || undefined,
      destination: destination || undefined,
      sort_price: sortPrice || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2">
          <Plane className="h-7 w-7 text-blue-600" /> Danh sách chuyến bay
        </h1>

        {/* Improved Filter Bar - user friendly and blue theme */}
        <form
          onSubmit={handleFilter}
          className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow px-6 py-5 relative z-10"
        >
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center mb-3">
            {/* Trip Type Dropdown */}
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-blue-200 bg-white text-blue-900 font-medium text-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all h-12 min-w-[140px]"
              >
                Chuyến khứ hồi{' '}
                <ChevronDown className="w-4 h-4 ml-1 text-blue-400" />
              </button>
            </div>
            {/* Passenger Count Dropdown */}
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-blue-200 bg-white text-blue-900 font-medium text-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all h-12 min-w-[150px]"
              >
                <Users className="w-4 h-4 mr-1 text-blue-400" /> 1 Hành khách{' '}
                <ChevronDown className="w-4 h-4 ml-1 text-blue-400" />
              </button>
            </div>
            {/* Cabin Class Dropdown */}
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-blue-200 bg-white text-blue-900 font-medium text-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all h-12 min-w-[120px]"
              >
                Phổ thông <ChevronDown className="w-4 h-4 ml-1 text-blue-400" />
              </button>
            </div>
            {/* Departure Location Dropdown */}
            <div
              className="relative flex-1 min-w-[180px] max-w-[220px]"
              ref={departureDropdownRef}
            >
              <button
                type="button"
                className="w-full border border-blue-200 rounded-full px-4 py-2 bg-white text-left text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none flex items-center justify-between h-12"
                onClick={() => setDepartureDropdownOpen((open) => !open)}
                tabIndex={0}
              >
                <span className="text-xs text-blue-400 block">Từ</span>
                <span
                  className={
                    departureLocation
                      ? 'font-medium text-blue-900'
                      : 'text-blue-400'
                  }
                >
                  {departureLocation
                    ? airports.find(
                        (airport) => airport.id === departureLocation
                      )?.city || 'Điểm khởi hành'
                    : 'Điểm khởi hành'}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 text-blue-400" />
              </button>
              {departureDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-100 z-20 animate-fade-in max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-100 ${
                      departureLocation === ''
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => {
                      setDepartureLocation('');
                      setDepartureDropdownOpen(false);
                    }}
                  >
                    Tất cả điểm đi
                  </button>
                  {airports.map((airport) => (
                    <button
                      key={airport.id}
                      type="button"
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-100 ${
                        departureLocation === airport.id
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => {
                        setDepartureLocation(airport.id);
                        setDepartureDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium">{airport.city}</div>
                      <div className="text-xs text-gray-500">
                        {airport.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Swap Button */}
            <div className="flex items-center mx-1">
              <button
                type="button"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 flex items-center justify-center shadow border-2 border-white -mx-2"
                aria-label="Đổi chiều đi/đến"
                onClick={() => {
                  // Swap departure and destination
                  const temp = departureLocation;
                  setDepartureLocation(destination);
                  setDestination(temp);
                }}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>
            {/* Destination Dropdown */}
            <div
              className="relative flex-1 min-w-[180px] max-w-[220px]"
              ref={destinationDropdownRef}
            >
              <button
                type="button"
                className="w-full border border-blue-200 rounded-full px-4 py-2 bg-white text-left text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none flex items-center justify-between h-12"
                onClick={() => setDestinationDropdownOpen((open) => !open)}
                tabIndex={0}
              >
                <span className="text-xs text-blue-400 block">Đến</span>
                <span
                  className={
                    destination ? 'font-medium text-blue-900' : 'text-blue-400'
                  }
                >
                  {destination
                    ? airports.find((airport) => airport.id === destination)
                        ?.city || 'Điểm đến'
                    : 'Điểm đến'}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 text-blue-400" />
              </button>
              {destinationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-100 z-20 animate-fade-in max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-100 ${
                      destination === ''
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => {
                      setDestination('');
                      setDestinationDropdownOpen(false);
                    }}
                  >
                    Tất cả điểm đến
                  </button>
                  {airports.map((airport) => (
                    <button
                      key={airport.id}
                      type="button"
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-100 ${
                        destination === airport.id
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => {
                        setDestination(airport.id);
                        setDestinationDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium">{airport.city}</div>
                      <div className="text-xs text-gray-500">
                        {airport.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center mt-2">
            {/* Date Pickers */}
            <div className="flex-1 min-w-[200px] max-w-[240px]">
              <UIDatePicker
                selected={dateFrom}
                onChange={setDateFrom}
                placeholder="Khởi hành"
                className="w-full rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-blue-900 font-medium h-12"
                dateFormat="eee, dd MMM, yyyy"
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-[240px]">
              <UIDatePicker
                selected={dateTo}
                onChange={setDateTo}
                placeholder="Về"
                className="w-full rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-blue-900 font-medium h-12"
                dateFormat="eee, dd MMM, yyyy"
              />
            </div>
            {/* Search Button */}
            <div className="flex items-center flex-1 min-w-[160px] max-w-[200px] md:justify-start justify-center">
              <Button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-3 shadow h-12 w-full md:w-auto justify-center"
                style={{ minWidth: 140 }}
              >
                <Search className="w-5 h-5 mr-1" /> Tìm kiếm
              </Button>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-blue-700">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : flights.length === 0 ? (
          <div className="text-center text-gray-500">
            Không có chuyến bay nào.
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {pagedFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6 flex flex-col h-full min-h-[220px] transition-all duration-200 hover:shadow-2xl hover:border-blue-400"
                >
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {/* Top: Route & Time */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-lg font-bold text-blue-700">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-blue-800 text-base">
                            {flight.departureAirport.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.departureAirport.city} (
                            {flight.departureAirport.id})
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-bold text-lg text-blue-900">
                              {new Date(
                                flight.departureTime
                              ).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(
                                flight.departureTime
                              ).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-2xl text-blue-400 font-bold">
                            →
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-pink-700 text-base">
                            {flight.arrivalAirport.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.arrivalAirport.city} (
                            {flight.arrivalAirport.id})
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-bold text-lg text-pink-900">
                              {new Date(flight.arrivalTime).toLocaleTimeString(
                                'vi-VN',
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(flight.arrivalTime).toLocaleDateString(
                                'vi-VN'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bottom: Seats, Price, Button */}
                    <div className="flex items-end justify-between mt-6 gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-500" />
                          <span className="font-bold text-lg text-green-700">
                            {flight.availableSeats}
                          </span>
                          <span className="text-xs text-gray-500">chỗ</span>
                        </div>
                        <div className="text-blue-700 font-bold text-xl">
                          {flight.basePrice.toLocaleString('vi-VN')}{' '}
                          <span className="text-base font-normal text-gray-500">
                            ₫
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow self-end"
                        onClick={() => navigate(`/flights/${flight.id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                size="icon"
                className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Trang trước"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="text-blue-900 font-semibold">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                size="icon"
                className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlightsListPage;
