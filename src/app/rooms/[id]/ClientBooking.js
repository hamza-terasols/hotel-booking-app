// /app/rooms/[id]/ClientBooking.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClientBooking({ hotel }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1 Adult");
  const [roomType, setRoomType] = useState("Standard Room");

  const handleClick = () => {
    const bookingData = {
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelImage: hotel.image, // ← yahi important hai
      location: hotel.location,
      description: hotel.description,
      price: hotel.price,
      checkIn,
      checkOut,
      guests,
      roomType,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Reserve Your Stay
          </h3>
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">
              PKR {hotel.price * 280}
            </span>
            <span className="text-gray-600">/ night</span>
          </div>
          <p className="text-sm text-gray-500">Taxes and fees included</p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>2 Adults, 1 Child</option>
              <option>2 Adults, 2 Children</option>
              <option>3 Adults</option>
              <option>4 Adults</option>
            </select>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Standard Room</option>
              <option>Deluxe Room (+PKR 2,800)</option>
              <option>Executive Suite (+PKR 5,600)</option>
              <option>Presidential Suite (+PKR 11,200)</option>
            </select>
          </div>
        </div>

        <Link href={`/checkout/${hotel._id}`} onClick={handleClick}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded">
            Book Now
          </button>
        </Link>

        <div className="text-center space-y-1 mt-3">
          <p className="text-xs text-green-600 font-medium">
            ✓ Free cancellation until 6 PM
          </p>
          <p className="text-xs text-green-600 font-medium">
            ✓ No booking or credit card fees
          </p>
          <p className="text-xs text-gray-500">Instant confirmation</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Need Assistance?</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span className="text-gray-700">+92-xxx-xxx-xxxx</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📧</span>
            <span className="text-gray-700">info@hotel.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span className="text-gray-700">24/7 Customer Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
