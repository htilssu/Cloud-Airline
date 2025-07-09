import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Plane, Calendar, Users } from 'lucide-react';
import axios from '../../lib/axios';

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

const FlightsListPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrom, setTimeFrom] = useState(''); // HH:mm
  const [timeTo, setTimeTo] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchFlights = async (params: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/flights', { params });
      setFlights(res.data);
    } catch (err: any) {
      setError('Không thể tải danh sách chuyến bay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Parse query params from URL and set initial filter state
    const params = new URLSearchParams(location.search);
    const time_from = params.get('time_from') || '';
    const time_to = params.get('time_to') || '';
    setTimeFrom(time_from);
    setTimeTo(time_to);
    fetchFlights({
      time_from: time_from || undefined,
      time_to: time_to || undefined,
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
  }, [sortPrice]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights({
      time_from: timeFrom || undefined,
      time_to: timeTo || undefined,
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
        <form onSubmit={handleFilter} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/80 p-4 rounded-xl shadow">
          <input
            type="time"
            placeholder="Giờ đi từ"
            value={timeFrom}
            onChange={e => setTimeFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          <input
            type="time"
            placeholder="Đến giờ"
            value={timeTo}
            onChange={e => setTimeTo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
            value={sortPrice}
            onChange={e => setSortPrice(e.target.value)}
          >
            <option value="">Sắp xếp theo giá</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
          <Button type="submit" className="col-span-1 md:col-span-4 mt-2 md:mt-0 bg-blue-600 text-white w-full md:w-auto">Lọc chuyến bay</Button>
        </form>

        {loading ? (
          <div className="text-center text-blue-700">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : flights.length === 0 ? (
          <div className="text-center text-gray-500">Không có chuyến bay nào.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Mã chuyến</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Điểm đi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Điểm đến</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Khởi hành</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Đến nơi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Còn chỗ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Giá từ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {flights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-blue-50 transition">
                    {/* Mã chuyến */}
                    <td className="px-4 py-3 font-mono text-blue-800">{flight.flightNumber || '-'}</td>
                    {/* Điểm đi */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-blue-700">{flight.departureAirport?.name || '-'}</div>
                      <div className="text-xs text-gray-500">{flight.departureAirport?.city || ''}</div>
                      <div className="text-xs text-gray-400">{flight.departureAirport?.id || ''}</div>
                    </td>
                    {/* Điểm đến */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-pink-700">{flight.arrivalAirport?.name || '-'}</div>
                      <div className="text-xs text-gray-500">{flight.arrivalAirport?.city || ''}</div>
                      <div className="text-xs text-gray-400">{flight.arrivalAirport?.id || ''}</div>
                    </td>
                    {/* Khởi hành */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {flight.departureTime ? new Date(flight.departureTime).toLocaleString('vi-VN') : '-'}
                      </div>
                    </td>
                    {/* Đến nơi */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString('vi-VN') : '-'}
                      </div>
                    </td>
                    {/* Còn chỗ */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-500" />
                        {typeof flight.availableSeats === 'number' ? flight.availableSeats : '-'}
                      </div>
                    </td>
                    {/* Giá từ */}
                    <td className="px-4 py-3 text-blue-700 font-semibold">
                      {typeof flight.basePrice === 'number' ? flight.basePrice.toLocaleString('vi-VN') + ' ₫' : '-'}
                    </td>
                    {/* Xem chi tiết */}
                    <td className="px-4 py-3">
                      <Button size="sm" onClick={() => navigate(`/flights/${flight.id}`)}>
                        Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightsListPage;
