"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function BookedHotelsTable() {
  const [bookedHotels, setBookedHotels] = useState([]);
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
    async function fetchBookedHotels() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = parseJwt(token);
        const adminId = decoded?.id || decoded?._id;
        if (!adminId) return;

        const res = await fetch(`/api/hotels/booked/admin/${adminId}`);
        const data = await res.json();
        console.log("API response:", data);
        setBookedHotels(data);
      } catch (error) {
        console.error("Error fetching booked hotels:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookedHotels();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero */}
      <div className="h-[40vh] w-full relative">
        <Hero />
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Booked Hotels</h1>

        {loading ? (
          <p className="text-center">Loading booked hotels...</p>
        ) : bookedHotels.length === 0 ? (
          <p className="text-center text-gray-500">
            No booked hotels found for you.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-6xl mx-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Hotel Name</th>
                  <th className="py-3 px-6 text-left">Booked By</th>

                  <th className="py-3 px-6 text-left">Location</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Rooms</th>
                  <th className="py-3 px-6 text-left">Amenities</th>
                  <th className="py-3 px-6 text-left">Image</th>

                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-medium font-light">
                {Array.isArray(bookedHotels) && bookedHotels.length > 0 ? (
                  bookedHotels.map((hotel) => (
                    <tr
                      key={hotel._id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">{hotel.name}</td>
                      <td className="py-3 px-6 capitalize text-left">
                        {hotel.bookedBy?.name || "Unknown"}
                      </td>
                      <td className="py-3 px-6 text-left">{hotel.location}</td>
                      <td className="py-3 px-6 text-left">${hotel.price}</td>
                      <td className="py-3 px-6 text-left">{hotel.rooms}</td>
                      <td className="py-3 px-6 text-left">
                        {hotel.amenities.join(", ")}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <img
                          src={hotel.image || "/images/default-hotel.jpg"}
                          alt={hotel.name}
                          className="w-20 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-6 text-green-600 font-bold">
                        Booked ✅
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      No booked hotels found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
