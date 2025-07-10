import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plane, MapPin, Calendar, Users, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import UIDatePicker from '../components/ui/datepicker';
import axios from '../lib/axios';
import { flights, airports, searchFlights, flightsForListPage } from '../mock/Flights';
import { format } from 'date-fns';

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
  { value: '', label: 'Sắp xếp theo giá' },
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
  const [sortPrice, setSortPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Refs for click outside
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  // Remove time picker refs

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Sort dropdown
      if (sortDropdownOpen && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
      // Time from dropdown
      // Time from dropdown
      // Time to dropdown
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sortDropdownOpen]);

  const totalPages = Math.ceil(flights.length / PAGE_SIZE);
  const pagedFlights = flights.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const fetchFlights = async (params: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      // const res = await axios.get('/flights', { params });
      // setFlights(res.data);
      setFlights(flightsForListPage);
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
    setDateFrom(date_from ? new Date(date_from) : null);
    setDateTo(date_to ? new Date(date_to) : null);
    fetchFlights({
      date_from: date_from || undefined,
      date_to: date_to || undefined,
    });
  }, [location.search]);

  // Sort flights in-place when sortPrice changes, do not refetch
  React.useEffect(() => {
    if (!sortPrice) return;
    setFlights(prev => {
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
      sort_price: sortPrice || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2">
          <Plane className="h-7 w-7 text-blue-600" /> Danh sách chuyến bay
        </h1>

        {/* Bộ lọc chỉ còn thời gian và sắp xếp theo giá */}
        <form onSubmit={handleFilter} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/80 p-4 rounded-xl shadow relative z-10">
          {/* Date Picker for dateFrom */}
          <UIDatePicker
            selected={dateFrom}
            onChange={setDateFrom}
            placeholder="Từ ngày"
            className="w-full rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          {/* Date Picker for dateTo */}
          <UIDatePicker
            selected={dateTo}
            onChange={setDateTo}
            placeholder="Đến ngày"
            className="w-full rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          {/* Custom Dropdown for Sort */}
          <div className="relative rounded-md items-center flex" ref={sortDropdownRef}>
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:border-blue-500 focus:ring-blue-500 outline-none flex items-center justify-between"
              onClick={() => setSortDropdownOpen((open) => !open)}
              tabIndex={0}
            >
              {sortOptions.find(opt => opt.value === sortPrice)?.label || sortOptions[0].label}
              <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {sortDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-blue-100 z-20 animate-fade-in">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-100 ${sortPrice === opt.value ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-blue-50'} ${opt.value === '' ? 'text-gray-700' : ''}`}
                    onClick={() => {
                      setSortPrice(opt.value);
                      setSortDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" className="col-span-1 md:col-span-4 mt-2 md:mt-0 bg-blue-600 text-white w-full md:w-auto">Lọc chuyến bay</Button>
        </form>

        {loading ? (
          <div className="text-center text-blue-700">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : flights.length === 0 ? (
          <div className="text-center text-gray-500">Không có chuyến bay nào.</div>
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
                        <span className="font-mono text-lg font-bold text-blue-700">{flight.flightNumber}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-blue-800 text-base">{flight.departureAirport.name}</div>
                          <div className="text-xs text-gray-500">{flight.departureAirport.city} ({flight.departureAirport.id})</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-bold text-lg text-blue-900">{new Date(flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-xs text-gray-500 ml-2">{new Date(flight.departureTime).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-2xl text-blue-400 font-bold">→</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-pink-700 text-base">{flight.arrivalAirport.name}</div>
                          <div className="text-xs text-gray-500">{flight.arrivalAirport.city} ({flight.arrivalAirport.id})</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-bold text-lg text-pink-900">{new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-xs text-gray-500 ml-2">{new Date(flight.arrivalTime).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bottom: Seats, Price, Button */}
                    <div className="flex items-end justify-between mt-6 gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-500" />
                          <span className="font-bold text-lg text-green-700">{flight.availableSeats}</span>
                          <span className="text-xs text-gray-500">chỗ</span>
                        </div>
                        <div className="text-blue-700 font-bold text-xl">
                          {flight.basePrice.toLocaleString('vi-VN')} <span className="text-base font-normal text-gray-500">₫</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow self-end" onClick={() => navigate(`/flights/${flight.id}`)}>
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
                className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
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
                className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
