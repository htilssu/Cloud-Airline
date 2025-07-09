import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plane, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from '../lib/axios';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { useToastNotifications } from '../hooks/useToastNotification';

interface Booking {
  id: number;
  bookingTime: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  expiresAt: string;
  flight: {
    id: number;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureAirport: { id: string; name: string; city: string };
    arrivalAirport: { id: string; name: string; city: string };
  };
  tickets: Array<{
    id: number;
    passengerName: string;
    seatNumber?: string;
    extraBaggageKg: number;
    finalPrice: number;
    ticketType: {
      id: number;
      name: string;
      priceMultiplier: number;
      baseBaggageAllowanceKg: number;
    };
  }>;
}

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthCheck();
  const { showSuccess, showError } = useToastNotifications();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth/sign-in');
      return;
    }
    
    if (!bookingId) return;
    fetchBookingDetails();
  }, [bookingId, user]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/bookings/${bookingId}`);
      setBooking(response.data);
      
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Booking không tồn tại hoặc bạn không có quyền truy cập');
      } else {
        setError('Không thể tải thông tin booking');
      }
      console.error('Error fetching booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!booking) return;
    
    try {
      setIsConfirming(true);
      
      await axios.post(`/bookings/${booking.id}/confirm`);
      showSuccess('Thanh toán thành công! Booking đã được xác nhận.');
      
      // Refresh booking data
      await fetchBookingDetails();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Có lỗi xảy ra khi xác nhận thanh toán';
      showError(errorMessage);
      console.error('Confirm booking error:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    if (!confirm('Bạn có chắc chắn muốn hủy booking này?')) {
      return;
    }
    
    try {
      setIsCancelling(true);
      
      await axios.post(`/bookings/${booking.id}/cancel`);
      showSuccess('Booking đã được hủy thành công');
      
      // Refresh booking data
      await fetchBookingDetails();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Có lỗi xảy ra khi hủy booking';
      showError(errorMessage);
      console.error('Cancel booking error:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Pending':
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'Đã xác nhận';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Pending':
      default:
        return 'Chờ thanh toán';
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Đã hết hạn';
    }
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
        <div className="text-center text-blue-700">Đang tải thông tin booking...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || 'Không tìm thấy booking'}</div>
          <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(booking.expiresAt) < new Date();
  const canConfirm = booking.status === 'Pending' && !isExpired;
  const canCancel = booking.status !== 'Confirmed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          ← Quay lại
        </Button>

        {/* Booking Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-2">
                Booking #{booking.id}
              </h1>
              <p className="text-gray-600">
                Đặt lúc: {new Date(booking.bookingTime).toLocaleString('vi-VN')}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(booking.status)}
                <span className="font-semibold">{getStatusText(booking.status)}</span>
              </div>
              
              {booking.status === 'Pending' && (
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {isExpired ? 'Đã hết hạn' : `Còn ${getTimeRemaining(booking.expiresAt)}`}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    Hạn thanh toán: {new Date(booking.expiresAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-2xl font-bold text-blue-700">
            Tổng tiền: {booking.totalPrice.toLocaleString('vi-VN')} ₫
          </div>
        </div>

        {/* Flight Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Thông tin chuyến bay</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {new Date(booking.flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(booking.flight.departureTime).toLocaleDateString('vi-VN')}
              </div>
              <div className="font-semibold text-blue-600 mt-2">{booking.flight.departureAirport.name}</div>
              <div className="text-sm text-gray-500">{booking.flight.departureAirport.city}</div>
            </div>

            <div className="text-center flex items-center justify-center">
              <div className="text-lg font-mono font-bold text-blue-800">
                {booking.flight.flightNumber}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-pink-700">
                {new Date(booking.flight.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(booking.flight.arrivalTime).toLocaleDateString('vi-VN')}
              </div>
              <div className="font-semibold text-pink-600 mt-2">{booking.flight.arrivalAirport.name}</div>
              <div className="text-sm text-gray-500">{booking.flight.arrivalAirport.city}</div>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Hành khách</h2>
          </div>

          <div className="space-y-4">
            {booking.tickets.map((ticket, index) => (
              <div key={ticket.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{ticket.passengerName}</h3>
                    <p className="text-gray-600">
                      Loại vé: {ticket.ticketType.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Hành lý: {ticket.ticketType.baseBaggageAllowanceKg}kg
                      {ticket.extraBaggageKg > 0 && ` + ${ticket.extraBaggageKg}kg thêm`}
                    </p>
                    {ticket.seatNumber && (
                      <p className="text-sm text-gray-500">
                        Chỗ ngồi: {ticket.seatNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-700">
                      {ticket.finalPrice.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {(canConfirm || canCancel) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex gap-4">
              {canConfirm && (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={isConfirming}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                >
                  {isConfirming ? 'Đang xử lý...' : 'Thanh toán ngay'}
                </Button>
              )}
              
              {canCancel && (
                <Button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50 py-3 text-lg font-semibold"
                >
                  {isCancelling ? 'Đang hủy...' : 'Hủy booking'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailPage;
