// /app/rooms/page.js
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DateRange } from "react-date-range"; // date picker
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState(1);
  const calendarRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.location.toLowerCase().includes(search.toLowerCase()) ||
      hotel.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/hotels");
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  return (
    <div className="bg-white text-black pb-40 min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="h-[40vh] w-full relative">
        <Hero />
      </div>

      {/* Book Now (Search Section) */}
      <div className="w-full bg-white py-10 px-4 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center lg:flex-row lg:items-stretch lg:text-left gap-6">
          {/* Book Now Label */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 lg:border-r border-gray-300">
            <h2 className="text-2xl font-bold">BOOK NOW</h2>
          </div>

          {/* Location Search */}
          <div className="flex-1 flex flex-col justify-center px-4 lg:border-r border-gray-300">
            <label className="block text-sm font-semibold text-gray-500 mb-1">
              LOCATION
            </label>
            <input
              type="text"
              placeholder="Enter city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Check In / Check Out */}
          <div
            ref={calendarRef}
            className="flex-1 flex flex-col justify-center px-4 lg:border-r border-gray-300 relative"
          >
            <label className="block text-sm font-semibold text-gray-500 mb-1">
              CHECK IN / CHECK OUT
            </label>
            <div
              className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span className="font-bold text-lg">
                {dateRange[0].startDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {dateRange[0].endDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {showCalendar && (
              <div className="absolute z-10 mt-2 bg-white shadow-lg">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
            )}
          </div>

          {/* Guests */}
          <div className="flex-1 flex flex-col justify-center px-4 lg:border-r border-gray-300">
            <label className="block text-sm font-semibold text-gray-500 mb-1">
              GUESTS
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
            </select>
          </div>

          {/* Check Availability */}
          <div className="flex-1 flex flex-col justify-center px-4 items-center lg:items-start">
            <button className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition">
              CHECK AVAILABILITY
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Results */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Browse Hotels</h1>

        {loading ? (
          <p>Loading hotels...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="border border-gray-300 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{hotel.name}</h2>
                    <p className="text-gray-500">{hotel.location}</p>
                    <p className="text-lg font-bold mt-2">
                      ${hotel.price} / night
                    </p>
                    <p className="text-sm text-gray-600">
                      Rooms: {hotel.rooms}
                    </p>
                    <p className="text-sm text-gray-500">
                      Amenities: {hotel.amenities.join(", ")}
                    </p>
                    <Link
                      href={`/rooms/${hotel._id}`}
                      className="mt-3 inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No hotels found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
