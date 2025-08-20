// /app/HotelManagement/page.js
"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header"; // 👈 use your header component
import Hero from "../components/Hero";

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editHotel, setEditHotel] = useState(null); // modal ke liye
  const [token, setToken] = useState(null); // ✅ FIX
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    rooms: "",
    amenities: "",
    image: "",
  });

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

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // 👈 token uthao

      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("rooms", formData.rooms);
      data.append("amenities", formData.amenities);
      0;
      data.append("image", formData.imageFile);

      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // 👈 yahan bhejna zaroori hai
        },
        body: data,
      });

      if (res.ok) {
        setShowModal(false);
        window.location.reload();
        setFormData({
          name: "",
          location: "",
          price: "",
          rooms: "",
          amenities: "",
          imageFile: null,
        });
      } else {
        alert("❌ Failed to add hotel");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    const decoded = parseJwt(storedToken);
    console.log("Decoded JWT:", decoded);

    setToken(storedToken);
    setLoggedInUserId(decoded?.id || decoded?._id);
  }, []);

  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchHotels = async () => {
      try {
        const res = await fetch(`/api/hotels/user/${loggedInUserId}`);
        const data = await res.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [loggedInUserId]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    try {
      await fetch(`/api/hotels/${id}`, { method: "DELETE" });
      setHotels(hotels.filter((hotel) => hotel._id !== id));
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  // update hotel
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await fetch(`/api/hotels/${editHotel._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editHotel),
      });

      setEditHotel(null); // close modal
      fetchHotels(); // refresh list
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  return (
    <div className="bg-white text-black pb-50 min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero */}
      <div className="h-[40vh] w-full relative">
        <Hero />
      </div>

      {/* Add Room Button */}
      <div className="flex justify-end max-w-6xl mx-auto mt-6 px-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-1.5 rounded-md font-bold font-serif hover:bg-gray-800 transition"
        >
          Add Room
        </button>
      </div>

      {/* Hotel Cards */}
      <div className="max-w-6xl mx-auto  mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {loading ? (
          <p className="col-span-full text-center">Loading hotels...</p>
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white shadow-md rounded-lg p-4 relative"
            >
              {hotel.booked && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Booked
                </span>
              )}
              <img
                src={hotel.image || "/images/default-hotel.jpg"}
                alt={hotel.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p className="text-gray-600">{hotel.location}</p>
              <p className="font-medium text-gray-800">
                ${hotel.price} / night · {hotel.rooms} rooms
              </p>
              <p className="text-sm text-gray-500">
                Amenities: {hotel.amenities.join(", ")}
              </p>

              {/* Action buttons */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setEditHotel(hotel)}
                  className="px-3 py-1 bg-gray-700 cursor-pointer text-white rounded "
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="px-3 py-1 bg-gray-700 cursor-pointer text-white rounded "
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No hotels found.
          </p>
        )}

        {/* Edit Modal */}
        {editHotel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Hotel</h2>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  value={editHotel.name}
                  onChange={(e) =>
                    setEditHotel({ ...editHotel, name: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="text"
                  value={editHotel.location}
                  onChange={(e) =>
                    setEditHotel({ ...editHotel, location: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="number"
                  value={editHotel.price}
                  onChange={(e) =>
                    setEditHotel({ ...editHotel, price: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="number"
                  value={editHotel.rooms}
                  onChange={(e) =>
                    setEditHotel({ ...editHotel, rooms: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="text"
                  value={editHotel.amenities}
                  onChange={(e) =>
                    setEditHotel({
                      ...editHotel,
                      amenities: e.target.value.split(","),
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="text"
                  value={editHotel.image}
                  onChange={(e) =>
                    setEditHotel({ ...editHotel, image: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditHotel(null)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-lg animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-serif text-gray-800">
                Add New Hotel
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddHotel} className="space-y-4">
              <input
                type="text"
                placeholder="Hotel Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black focus:outline-none"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black focus:outline-none"
              />
              <input
                type="number"
                placeholder="Price per night"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black focus:outline-none"
              />
              <input
                type="number"
                placeholder="Number of Rooms"
                value={formData.rooms}
                onChange={(e) =>
                  setFormData({ ...formData, rooms: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black focus:outline-none"
              />
              <input
                type="text"
                placeholder="Amenities (comma separated)"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black focus:outline-none"
              />

              {/* File Upload with Preview */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Upload Hotel Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      imageFile: e.target.files[0],
                      imagePreview: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                  className="border rounded-lg px-3 py-2 w-full cursor-pointer focus:ring-2 focus:ring-black focus:outline-none"
                />
                {formData.imagePreview && (
                  <div className="mt-3">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2 rounded-lg font-semibold transition 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black text-white hover:bg-gray-800"
    }`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
