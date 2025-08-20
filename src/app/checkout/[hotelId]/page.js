"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1 Adult");
  const [roomType, setRoomType] = useState("Standard Room");
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const USD_RATE = 300; // Example: 1 PKR ≈ 0.004 USD
  const [email, setEmail] = useState(""); // <-- add this
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const router = useRouter();


  useEffect(() => {
    const username = localStorage.getItem("username"); // safe inside useEffect
    setIsLoggedIn(!!username);
  }, []);
  useEffect(() => {
    const bookingData = JSON.parse(localStorage.getItem("bookingData"));
    if (bookingData) {
      setHotel({
        _id: bookingData.hotelId,
        price: bookingData.price,
        name: bookingData.hotelName || "Hotel",
        image: bookingData.hotelImage,
        location: bookingData.location || "Unknown",
      });
      setCheckIn(bookingData.checkIn);
      setCheckOut(bookingData.checkOut);
      setGuests(bookingData.guests);
      setRoomType(bookingData.roomType);
    }
  }, []);

  if (!hotel) return <p>Loading...</p>;

  const nights =
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
    (1000 * 60 * 60 * 24);

  const numGuests = parseInt(guests.split(" ")[0]);
  const totalPKR = hotel.price * nights * numGuests;
  const totalUSD = (totalPKR * USD_RATE).toFixed(2);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }

      const decoded = parseJwt(token);
      const userId = decoded?.id;
      if (!userId) {
        alert("Invalid token. Please login again.");
        return;
      }

      const response = await fetch(`/api/hotels/book/${hotel._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // send userId to backend
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      alert("Booking confirmed!");
      setShowModal(true);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
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

  return (
    <div className="min-h-screen bg-white p-6 font-serif">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Confirm Your Booking
        </h1>
        <p className="text-gray-600">
          Review your reservation details and proceed to secure your stay
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 text-lg">
        {/* Left: Hotel Info */}
        <div className="lg:col-span-2 space-y-4">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-64 md:h-80 object-cover rounded-lg shadow"
          />
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <p className="text-gray-700">{hotel.description}</p>
          <p className="font-semibold text-gray-900">
            Location: {hotel.location}
          </p>
          <p className="font-bold text-lg">
            Price per night: USD {hotel.price} | PKR{" "}
            {(hotel.price * USD_RATE).toFixed(2)}
          </p>
          <p className="font-semibold text-gray-900">
            Check-in: {checkIn} | Check-out: {checkOut} | Nights: {nights}
          </p>
          <p className="font-semibold text-gray-900">Guests: {guests}</p>
          <p className="font-semibold text-gray-900">Room Type: {roomType}</p>
          <p className="font-bold text-xl">
            Total: USD {totalPKR} | PKR {totalUSD}
          </p>

          {/* Professional Instructions */}
          <div className="mt-6  bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-medium text-gray-700">
            <p>• Check-in time is 1400 hours.</p>
            <p>• Check-out time is 1200 hours.</p>
            <p>• Face Mask is mandatory in all public areas of the hotel.</p>
            <p>
              • Returnable deposit of Rs.5000 per room per night is essential at
              check-in along with room rate and taxes.
            </p>
            <p>
              • No weapons are allowed in the premises. Entry will be restricted
              if found.
            </p>
            <p>
              • CNIC for domestic guests and Passport + valid visa for foreign
              guests is mandatory as per Government policy.
            </p>
            <p>
              • Non-refundable reservation: 10%-15% discount applied and card
              charged immediately. Hotel can adjust discount if needed.
            </p>
            <p>
              • Flexible reservation: Card not charged upon booking, only
              collected to confirm. Can cancel/modify till 4 PM on arrival day.
            </p>
            <p>
              • Rates quoted in USD calculated using arrival day exchange rate.
              Use "Pay Now" to fix rate.
            </p>
            <p>• Additional bank charges may apply.</p>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Booking Details
          </h2>

          {/* Checkout Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();

              // Validate all fields
              if (!email || !card || !expiry || !cvv || !name || !country) {
                alert("Please fill in all fields correctly.");
                return;
              }

              // Additional input validations
              const cardDigits = card.replace(/\D/g, ""); // remove non-digits
              if (cardDigits.length !== 16) {
                alert("Card Number must be 16 digits.");
                return;
              }

              if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                alert("Expiry must be in MM/YY format.");
                return;
              }

              if (!/^\d{3}$/.test(cvv)) {
                alert("CVC must be 3 digits.");
                return;
              }

              // Show modal if everything is valid
              setShowModal(true);
            }}
          >
            {/* Email */}
            <div className="space-y-2 pb-5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2 pb-4">
              <label className="text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                value={card}
                onChange={(e) =>
                  setCard(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                placeholder="1234 1234 1234 1234"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Expiry / CVC */}
            <div className="grid grid-cols-2 gap-2 pb-4">
              <input
                type="text"
                value={expiry}
                onChange={(e) =>
                  setExpiry(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                      .replace(/(\d{2})(\d{0,2})/, "$1/$2")
                  )
                }
                placeholder="MM/YY"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
                placeholder="CVC"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2 pb-4">
              <label className="text-sm text-gray-700">Cardholder Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name on card"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Country */}
            <div className="space-y-2 pb-4">
              <label className="text-sm text-gray-700">Country or region</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select Country</option>
                <option value="Pakistan">Pakistan</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="India">India</option>
              </select>
            </div>

            {/* Confirm Button */}
            {isLoggedIn ? (
              <button
                type="submit"
                onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                Confirm Booking
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(
                    "redirectAfterLogin",
                    window.location.href
                  );
                  window.location.href = "/Signup";
                }}
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-pointer"
              >
                Login to Confirm Booking
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
            <Check className="text-green-500 w-12 h-12 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">
              ✅ Room Reserved!
            </h2>
            <p className="text-gray-700">
              {hotel.name} has been successfully reserved.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                router.push("/rooms"); 
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
