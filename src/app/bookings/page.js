"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

 
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Invalid JWT", e);
      return null;
    }
  }

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = parseJwt(token);
        const userId = decoded?.id || decoded?._id;

        if (!userId) return;

        const res = await fetch(`/api/bookings/${userId}`);
        const data = await res.json();

        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero */}
      <div className="h-[40vh] w-full relative">
        <Hero
          title="My Bookings"
          subtitle="Here are the rooms you’ve reserved"
        />
      </div>

      {/* Bookings Table */}
      <main className="max-w-7xl mx-auto w-full p-8">
        {loading ? (
          <p className="text-center">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            You have no bookings yet.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">Hotel</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Rooms</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((hotel) => (
                  <tr key={hotel._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="pr-19 md:pr-0 flex items-center gap-3">
                      <img
                        src={hotel.image || "/images/default-hotel.jpg"}
                        alt={hotel.name}
                        className="w-14 h-14 rounded object-cover"
                      />
                      {hotel.name}
                    </td>
                    <td className="p-3">{hotel.location}</td>
                    <td className="p-3">${hotel.price}</td>
                    <td className="p-3">{hotel.rooms}</td>
                    <td className="p-3">
                      {new Date(hotel.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}