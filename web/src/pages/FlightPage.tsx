import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Plane,
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wifi,
  Coffee,
  Briefcase,
  Heart,
  Share2,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';
import {
  getFlightById,
  Flight,
  Airport,
  Plane as PlaneType,
} from '../mock/Flights';

const FlightPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [passengerCount, setPassengerCount] = useState<number>(1);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!id) {
        setError('ID chuyến bay không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const flightData = getFlightById(parseInt(id));
        if (!flightData) {
          setError('Không tìm thấy chuyến bay');
          setLoading(false);
          return;
        }

        // Ensure all related data is populated
        const flightDetail: Flight = {
          ...flightData,
          departure_airport: flightData.departure_airport!,
          arrival_airport: flightData.arrival_airport!,
          plane: flightData.plane!,
        };

        setFlight(flightDetail);
      } catch (err) {
        setError('Không thể tải thông tin chuyến bay');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Delayed':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'Đúng giờ';
      case 'Delayed':
        return 'Bị trễ';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Scheduled':
        return 'Đã lên lịch';
      case 'Completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'text-green-600 bg-green-100';
      case 'Delayed':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      case 'Scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'Completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const totalPrice = flight ? flight.base_price * passengerCount : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Đang tải thông tin chuyến bay...</p>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Không tìm thấy chuyến bay'}
          </p>
          <Button
            onClick={() => navigate('/flights')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/flights')}
            className="flex items-center gap-2 text-blue-700 hover:bg-blue-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            <Plane className="h-8 w-8 text-blue-600" />
            Chi tiết chuyến bay
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Flight Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
              {/* Flight Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-blue-700">
                    {flight.flight_number}
                  </span>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      flight.status
                    )}`}
                  >
                    {getStatusIcon(flight.status)}
                    {getStatusText(flight.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Route Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Departure */}
                <div className="text-center">
                  <div className="font-semibold text-blue-800 text-lg mb-1">
                    {flight.departure_airport?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {flight.departure_airport?.city || 'N/A'} (
                    {flight.departure_airport?.id || 'N/A'})
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-bold text-xl text-blue-900">
                      {new Date(flight.departure_time).toLocaleTimeString(
                        'vi-VN',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(flight.departure_time).toLocaleDateString(
                      'vi-VN',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </div>
                </div>

                {/* Flight Duration */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl text-blue-400 font-bold mb-2">
                      →
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {calculateDuration(
                        flight.departure_time,
                        flight.arrival_time
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Thời gian bay</div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-center">
                  <div className="font-semibold text-pink-700 text-lg mb-1">
                    {flight.arrival_airport?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {flight.arrival_airport?.city || 'N/A'} (
                    {flight.arrival_airport?.id || 'N/A'})
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-bold text-xl text-pink-900">
                      {new Date(flight.arrival_time).toLocaleTimeString(
                        'vi-VN',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(flight.arrival_time).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Aircraft Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-600" />
                  Thông tin máy bay
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Mã máy bay</div>
                    <div className="font-semibold text-blue-700">
                      {flight.plane?.code || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      Tổng số ghế
                    </div>
                    <div className="font-semibold text-blue-700">
                      {flight.plane?.total_seats || 0} ghế
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Wifi className="h-5 w-5 text-blue-600" />
                Tiện ích trên chuyến bay
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Wi-Fi miễn phí
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Coffee className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Đồ uống miễn phí
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    Hành lý xách tay
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Đặt vé</h3>

              {/* Passenger Count */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số hành khách
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPassengerCount(Math.max(1, passengerCount - 1))
                    }
                    disabled={passengerCount <= 1}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">
                    {passengerCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPassengerCount(Math.min(9, passengerCount + 1))
                    }
                    disabled={passengerCount >= 9}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá vé cơ bản</span>
                  <span className="font-medium">
                    {flight.base_price.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số hành khách</span>
                  <span className="font-medium">× {passengerCount}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-blue-700">
                      {totalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <Button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <CreditCard className="h-5 w-5 mr-2" />
                Đặt vé ngay
              </Button>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Hỗ trợ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">1900-1234</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">
                    support@cloudairline.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPage;
