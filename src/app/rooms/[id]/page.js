// /app/rooms/[id]/page.js
import { notFound } from "next/navigation";
import connectMongo from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
} from "lucide-react";

import ClientBooking from "./ClientBooking";

// Amenity icon mapping
const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  gym: Dumbbell,
  pool: Waves,
  restaurant: Utensils,
  "free wifi": Wifi,
  "free parking": Car,
  "fitness center": Dumbbell,
  "swimming pool": Waves,
};

const getAmenityIcon = (amenity) => {
  const key = amenity.toLowerCase();
  return amenityIcons[key] || Coffee;
};

export default async function HotelDetails({ params }) {
  const { id } = params;
  await connectMongo();
  const hotel = await Hotel.findById(id).lean();

  if (!hotel) return notFound();
  const safeHotel = JSON.parse(JSON.stringify(hotel));

  const rating = hotel.rating || 4.5;
  const reviewCount = hotel.reviewCount || 128;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-serif">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Book Your Room
        </h1>
        <p className="text-gray-600">
          Find the perfect stay for your next adventure
        </p>
      </div>

      {/* Hotel Image */}
      <div className="mb-6">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hotel Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-gray-500 w-4 h-4" />
              <span className="text-gray-600">{hotel.location}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {hotel.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{rating}</span>
              <span className="text-gray-500">({reviewCount} reviews)</span>
            </div>

            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Amenities & Facilities
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {hotel.amenities.map((amenity, index) => {
                const IconComponent = getAmenityIcon(amenity);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded bg-gray-50"
                  >
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotel Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Hotel Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in Time:</span>
                  <span className="font-medium">3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out Time:</span>
                  <span className="font-medium">11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium">Hotel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-medium">English, Urdu</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancellation:</span>
                  <span className="font-medium text-green-600">
                    Free until 6 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-medium">Pay at Hotel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pets:</span>
                  <span className="font-medium">Not Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Smoking:</span>
                  <span className="font-medium">Non-smoking Rooms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Important Information
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Valid photo ID and credit card required at check-in</p>
              <p>
                • Hotel reserves the right to pre-authorize credit cards prior
                to arrival
              </p>
              <p>
                • Special requests are subject to availability and may incur
                additional charges
              </p>
              <p>
                • Property is committed to sustainable practices and
                eco-friendly operations
              </p>
            </div>
          </div>
        </div>

        {/* Booking Sidebar - Client Component */}
        <ClientBooking hotel={safeHotel} />
      </div>
    </div>
  );
}
