import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plane, MapPin, Calendar, Users } from 'lucide-react';
import UIDatePicker from '../components/ui/datepicker';
import axios from '../lib/axios';

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
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null); // datetime picker
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [timeFrom, setTimeFrom] = useState(''); // HH:mm
  const [timeTo, setTimeTo] = useState('');
  const navigate = useNavigate();

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
    fetchFlights();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights({
      departure_airport_id: from || undefined,
      arrival_airport_id: to || undefined,
      flight_date: date ? date.toISOString().split('T')[0] : undefined,
      flight_datetime: dateTime ? dateTime.toISOString() : undefined,
      search: search || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      time_from: timeFrom || undefined,
      time_to: timeTo || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2">
          <Plane className="h-7 w-7 text-blue-600" /> Danh sách chuyến bay
        </h1>

        {/* Bộ lọc & tìm kiếm */}
        <form onSubmit={handleFilter} className="mb-8 grid grid-cols-1 md:grid-cols-7 gap-4 bg-white/80 p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Tìm mã chuyến, thành phố, sân bay..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Mã sân bay đi (VD: HAN)"
            value={from}
            onChange={e => setFrom(e.target.value.toUpperCase())}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Mã sân bay đến (VD: SGN)"
            value={to}
            onChange={e => setTo(e.target.value.toUpperCase())}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          <UIDatePicker
            selected={date}
            onChange={setDate}
            minDate={new Date()}
            placeholder="Ngày đi"
            className="w-full"
          />
          <UIDatePicker
            selected={dateTime}
            onChange={setDateTime}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholder="Ngày & giờ đi cụ thể"
            className="w-full"
          />
          <input
            type="number"
            placeholder="Giá từ (₫)"
            min={0}
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Đến (₫)"
            min={0}
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
          />
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
          <Button type="submit" className="col-span-1 md:col-span-6 mt-2 md:mt-0 bg-blue-600 text-white w-full md:w-auto">Lọc chuyến bay</Button>
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
