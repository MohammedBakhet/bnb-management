'use client';

import { useEffect, useState } from 'react';

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrls: string[];
  amenities: string[];
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const data: Property = await res.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property && checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * property.pricePerNight);
    }
  }, [checkInDate, checkOutDate, property]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: property?.id,
          checkInDate,
          checkOutDate,
        }),
      });

      if (res.ok) {
        alert('Booking request sent!');
        setCheckInDate('');
        setCheckOutDate('');
        setTotalPrice(0);
      } else {
        setBookingError('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError('An error occurred during booking');
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
      {/* Left section for property images and details */}
      <div className="lg:w-2/3 space-y-4">
        <h1 className="text-3xl font-bold">{property.name}</h1>
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          {property.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={property.name}
              className={`w-full h-auto max-h-80 object-cover rounded-lg shadow col-span-2${index === 0 ? 'col-span-2' : ''}`}
            />
          ))}
        </div>
        <p className="text-gray-600 mt-4">{property.description}</p>
        <p className="text-gray-500 mt-2">{property.location}</p>
        <div className="text-purple-600 font-bold mt-2 text-lg">
          €{property.pricePerNight} / night
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Amenities:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {property.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right section for booking form */}
      <div className="lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Book this property</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
          <label className="block text-gray-700 mb-1">Check-in:</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4"
          />
          <label className="block text-gray-700 mb-1">Check-out:</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4"
          />
          <p className="text-lg font-bold mt-2">Total Price: €{totalPrice}</p>
          {bookingError && <p className="text-red-500 mt-2">{bookingError}</p>}
          <button type="submit" className="bg-red-500 text-white py-2 w-full rounded-md mt-4">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
