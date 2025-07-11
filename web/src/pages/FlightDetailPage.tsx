import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import axios from '../lib/axios';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { useToastNotifications } from '../hooks/useToastNotification';
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

interface TicketType {
  id: number;
  name: string;
  priceMultiplier: number;
  baseBaggageAllowanceKg: number;
  calculatedPrice?: number;
  description: string;
}

interface AddonOption {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  isActive: boolean;
}

interface PassengerInfo {
  name: string;
  ticketTypeId: number;
  selectedAddons: number[];
}

const FlightDetailPage: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthCheck();
  const { showSuccess, showError } = useToastNotifications();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [addonOptions, setAddonOptions] = useState<AddonOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { name: '', ticketTypeId: 1, selectedAddons: [] },
  ]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!flightId) return;
    fetchFlightDetails();
  }, [flightId]);

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch flight details
      const flightRes = await axios.get(`/flights/${flightId}`);
      setFlight(flightRes.data);

      // Fetch ticket types with calculated prices for this specific flight
      const ticketTypesRes = await axios.get(`/ticket-options/${flightId}`);
      setTicketTypes(ticketTypesRes.data);

      // Fetch addon options
      const addonRes = await axios.get('/ticket-options/addon-options');
      const allAddons: AddonOption[] = [];
      addonRes.data.forEach((group: any) => {
        allAddons.push(...group.options);
      });
      setAddonOptions(allAddons.filter((addon) => addon.isActive));
    } catch (err: any) {
      setError('Không thể tải thông tin chuyến bay.');
      console.error('Error fetching flight details:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { name: '', ticketTypeId: 1, selectedAddons: [] },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const updatePassenger = (
    index: number,
    field: keyof PassengerInfo,
    value: any
  ) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const toggleAddon = (passengerIndex: number, addonId: number) => {
    const updated = [...passengers];
    const selectedAddons = updated[passengerIndex].selectedAddons;

    if (selectedAddons.includes(addonId)) {
      updated[passengerIndex].selectedAddons = selectedAddons.filter(
        (id) => id !== addonId
      );
    } else {
      updated[passengerIndex].selectedAddons = [...selectedAddons, addonId];
    }

    setPassengers(updated);
  };

  const calculateTotalPrice = () => {
    return passengers.reduce((total, passenger) => {
      const ticketType = ticketTypes.find(
        (tt) => tt.id === passenger.ticketTypeId
      );
      const ticketPrice = ticketType?.calculatedPrice || 0;

      const addonsPrice = passenger.selectedAddons.reduce(
        (addonTotal, addonId) => {
          const addon = addonOptions.find((a) => a.id === addonId);
          return addonTotal + (addon?.price || 0);
        },
        0
      );

      return total + ticketPrice + addonsPrice;
    }, 0);
  };

  const handleBooking = async () => {
    if (!user) {
      showError('Vui lòng đăng nhập để đặt vé');
      navigate('/auth/sign-in');
      return;
    }

    // Validate passenger names
    const invalidPassenger = passengers.find((p) => !p.name.trim());
    if (invalidPassenger) {
      showError('Vui lòng nhập tên cho tất cả hành khách');
      return;
    }

    try {
      setIsBooking(true);

      const bookingData = {
        flightId: parseInt(flightId!),
        passengers: passengers.map((p) => ({
          passengerName: p.name.trim(),
          ticketTypeId: p.ticketTypeId,
          addonOptionIds: p.selectedAddons,
        })),
      };

      const response = await axios.post('/bookings', bookingData);

      showSuccess('Đặt vé thành công! Vui lòng thanh toán trong 30 phút.');
      navigate(`/bookings/${response.data.id}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        'Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.';
      showError(errorMessage);
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        <Header />
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-blue-700">
            Đang tải thông tin chuyến bay...
          </div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        <Header />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              {error || 'Không tìm thấy chuyến bay'}
            </div>
            <Button onClick={() => navigate('/flights')}>
              Quay lại danh sách chuyến bay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (start: string, end: string) => {
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/flights')}
          className="mb-6"
        >
          ← Quay lại
        </Button>

        {/* Flight Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">
              Chi tiết chuyến bay {flight.flightNumber}
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Departure */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {new Date(flight.departureTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(flight.departureTime).toLocaleDateString('vi-VN')}
              </div>
              <div className="font-semibold text-blue-600 mt-2">
                {flight.departureAirport?.name}
              </div>
              <div className="text-sm text-gray-500">
                {flight.departureAirport?.city}
              </div>
            </div>

            {/* Duration */}
            <div className="text-center flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-2">
                {formatDuration(flight.departureTime, flight.arrivalTime)}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1 h-0.5 bg-blue-300"></div>
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <div className="flex-1 h-0.5 bg-blue-300"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Bay thẳng</div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-700">
                {new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(flight.arrivalTime).toLocaleDateString('vi-VN')}
              </div>
              <div className="font-semibold text-pink-600 mt-2">
                {flight.arrivalAirport?.name}
              </div>
              <div className="text-sm text-gray-500">
                {flight.arrivalAirport?.city}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm">Còn {flight.availableSeats} chỗ</span>
              </div>
            </div>
            <div className="text-lg font-semibold text-blue-700">
              Giá từ {flight.basePrice.toLocaleString('vi-VN')} ₫
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Tùy chọn có sẵn
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ticket Types Overview */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Loại vé</h3>
              <div className="space-y-2">
                {ticketTypes.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-medium">{ticketType.name}</span>
                    <span className="text-blue-600 font-semibold">
                      {(ticketType.calculatedPrice || 0).toLocaleString(
                        'vi-VN'
                      )}{' '}
                      ₫
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Overview */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Dịch vụ bổ sung
              </h3>
              <div className="space-y-2">
                {addonOptions.slice(0, 4).map((addon) => (
                  <div
                    key={addon.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-medium">{addon.name}</span>
                    <span className="text-green-600 font-semibold">
                      +{addon.price.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                ))}
                {addonOptions.length > 4 && (
                  <div className="text-xs text-gray-500 italic">
                    +{addonOptions.length - 4} dịch vụ khác...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Hướng dẫn:</strong> Chọn loại vé và dịch vụ bổ sung cho
              từng hành khách bên dưới. Mỗi hành khách có thể chọn loại vé và
              dịch vụ khác nhau.
            </p>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-blue-900">
              Thông tin hành khách
            </h2>
            <Button
              onClick={addPassenger}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              + Thêm hành khách
            </Button>
          </div>

          {passengers.map((passenger, index) => (
            <div key={index} className="bg-gray-50 border rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl text-blue-900">
                    Hành khách {index + 1}
                  </h3>
                </div>
                {passengers.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePassenger(index)}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    Xóa
                  </Button>
                )}
              </div>

              {/* Passenger Name */}
              <div className="mb-6 bg-white rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) =>
                    updatePassenger(index, 'name', e.target.value)
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              {/* Ticket Type Selection */}
              <div className="mb-6 bg-white rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn loại vé *
                </label>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {ticketTypes.map((ticketType) => (
                    <div
                      key={ticketType.id}
                      className={`border-2 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer ${
                        passenger.ticketTypeId === ticketType.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                          : 'border-gray-200 bg-white hover:bg-blue-25'
                      }`}
                      onClick={() =>
                        updatePassenger(index, 'ticketTypeId', ticketType.id)
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-base text-gray-800">
                          {ticketType.name}
                        </h4>
                        {passenger.ticketTypeId === ticketType.id && (
                          <div className="bg-blue-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {ticketType.description}
                      </p>
                      <div className="text-lg font-bold text-blue-700 mb-2">
                        {(ticketType.calculatedPrice || 0).toLocaleString(
                          'vi-VN'
                        )}{' '}
                        ₫
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 inline-block">
                        Hành lý: {ticketType.baseBaggageAllowanceKg}kg
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addon Options */}
              <div className="bg-white rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dịch vụ bổ sung (tùy chọn)
                </label>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {addonOptions.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        passenger.selectedAddons.includes(addon.id)
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-25'
                      }`}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="flex-shrink-0 mt-0.5">
                          <Checkbox
                            checked={passenger.selectedAddons.includes(
                              addon.id
                            )}
                            onCheckedChange={() => toggleAddon(index, addon.id)}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-800">
                              {addon.name}
                            </span>
                            {passenger.selectedAddons.includes(addon.id) && (
                              <div className="bg-green-500 rounded-full p-1 ml-2">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {addon.description}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-green-600">
                              +{addon.price.toLocaleString('vi-VN')} ₫
                            </span>
                            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded">
                              {addon.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary & Booking */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-900">Tổng kết đặt vé</h2>
            <div className="text-2xl font-bold text-blue-700">
              {calculateTotalPrice().toLocaleString('vi-VN')} ₫
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {passengers.map((passenger, index) => {
              const ticketType = ticketTypes.find(
                (tt) => tt.id === passenger.ticketTypeId
              );
              const addonsPrice = passenger.selectedAddons.reduce(
                (total, addonId) => {
                  const addon = addonOptions.find((a) => a.id === addonId);
                  return total + (addon?.price || 0);
                },
                0
              );

              return (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {passenger.name || `Hành khách ${index + 1}`} -{' '}
                    {ticketType?.name}
                    {addonsPrice > 0 && ` + Dịch vụ`}
                  </span>
                  <span>
                    {(
                      (ticketType?.calculatedPrice || 0) + addonsPrice
                    ).toLocaleString('vi-VN')}{' '}
                    ₫
                  </span>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleBooking}
            disabled={isBooking || passengers.some((p) => !p.name.trim())}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            {isBooking ? 'Đang đặt vé...' : 'Đặt vé ngay'}
          </Button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Sau khi đặt vé, bạn có 30 phút để thanh toán. Vé sẽ bị hủy tự động
            nếu không thanh toán trong thời gian này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailPage;
