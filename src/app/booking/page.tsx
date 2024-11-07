'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrls: string[];
  amenities: string[];
  ownerId: string;
}

interface Booking {
  id: string;
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  ownerId: string;
}

export default function BookingsPage() {
  const { user, isAdmin } = useAuth(); // Access isAdmin
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/booking', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/booking', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, action }),
      });

      if (res.ok) {
        setBookings(bookings.map((booking) => {
          if (booking.id === bookingId) {
            return { ...booking, status: action === 'accept' ? 'accepted' : 'rejected' };
          }
          return booking;
        }));
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8">Your Bookings</h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{booking.property.name}</h3>
              <p className="text-gray-600">Location: {booking.property.location}</p>
              <p className="text-gray-600">Check-In Date: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Check-Out Date: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Total Price: ${booking.totalPrice}</p>
              <p className="text-gray-600">Status: {booking.status}</p>
              {(booking.status === 'pending') && (user?.id === booking.property.ownerId || isAdmin) && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleBookingAction(booking.id, 'accept')}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBookingAction(booking.id, 'reject')}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
