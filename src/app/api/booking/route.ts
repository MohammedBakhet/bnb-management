

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/authMiddleware';

// GET method to fetch bookings for the authenticated user
export async function GET(req: NextRequest) {
  console.log("GET /api/booking endpoint hit"); // Debugging log
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { property: true },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST and PATCH methods remain as previously defined...

// POST method to create a booking
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId, checkInDate, checkOutDate } = await req.json();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    // Calculate total price
    const stayDuration = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = stayDuration * property.pricePerNight;

    const booking = await prisma.booking.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalPrice,
        status: 'pending',
        userId: user.id,
        propertyId: property.id,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}

// PATCH method to update booking status
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const { bookingId, action } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const isListingAgent = booking.property.ownerId === user.id || user.isAdmin;
    if (!isListingAgent) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const updatedStatus = action === 'accept' ? 'accepted' : 'rejected';
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: updatedStatus },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}
