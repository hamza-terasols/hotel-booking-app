// /app/Landing/page.js
"use client";

import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleClick = () => {
    router.push("/rooms"); // 👈 rooms tab/page par le jayega
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

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

  return (
    <div className="w-full bg-white text-black">
      {/* Full viewport for Header + Hero */}
      <div className="w-full h-screen relative">
        <Header className="absolute top-0 left-0 w-full z-20" />
        <HeroSlider /> {/* This should fill full screen */}
      </div>

      <div className="flex justify-center items-center bg-white pb-18 md:py-40">
        <p className="text-3xl md:text-4xl font-serif font-bold text-center max-w-5xl">
          Welcome to Your Dream Stay. Browse hotels, and reserve your room in
          just a few clicks.
        </p>
      </div>

      {/* Paragraph appears after scrolling past hero */}

      <div className="w-full bg-white py-10 px-4 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch">
          {/* Book Now */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-4 lg:border-r lg:border-gray-300 mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold">BOOK NOW</h2>
          </div>

          {/* Check In / Check Out */}
          <div
            ref={calendarRef}
            className="flex-1 flex flex-col justify-center px-4 relative mb-4 lg:mb-0 lg:border-r lg:border-gray-300"
          >
            <label className="block text-sm font-semibold text-gray-500 mb-1 text-center lg:text-left">
              CHECK IN / CHECK OUT
            </label>
            <div
              className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer text-center lg:text-left"
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
              <div className="absolute z-10 mt-2">
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
          <div className="flex-1 flex flex-col justify-center px-4 mb-4 lg:mb-0 lg:border-r lg:border-gray-300">
            <label className="block text-sm font-semibold text-gray-500 mb-1 text-center lg:text-left">
              GUESTS
            </label>
            <input
              type="number"
              min={1}
              step={1}
              defaultValue={1}
              className="border border-gray-300 rounded-md px-3 py-2 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center lg:text-left"
            />
          </div>

          {/* Check Availability */}
          <div className="flex-1 flex flex-col justify-center px-4 items-center lg:items-start">
            <button
              onClick={handleClick}
              className="bg-black text-white px-6 py-3 cursor-pointer rounded-md font-semibold hover:bg-gray-800 transition"
            >
              CHECK AVAILABILITY
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mb-12 md:mb-15 mt-15 flex justify-center bg-white py-20 px-6">
        <div className="max-w-6xl flex flex-col lg:flex-row items-center gap-10 text-center md:text-left">
          {/* Left Column - Text */}
          <div className="flex-1 space-y-4">
            <h4 className="text-lg font-semibold font-serif text-gray-500">
              Welcome to our Hotel
            </h4>
            <h2 className="text-4xl font-bold font-serif text-gray-900">
              Experience Comfort <br /> with Elegance
            </h2>
            <p className="text-gray-600 font-serif text-lg">
              At our Hotel, we blend modern luxury with timeless hospitality.
              Our spacious rooms, world-class dining, and exceptional services
              make every stay unforgettable. Whether you’re traveling for
              leisure or business, we provide the perfect environment to relax
              and enjoy.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-md font-semibold cursor-pointer transition">
              Discover More
            </button>
          </div>

          {/* Right Column - Responsive Images */}
          <div className="flex-1 flex flex-col md:flex-row justify-center gap-6 relative w-full">
            {/* Left Image */}
            <img
              src="/images/room1.jpg"
              alt="Luxury Room"
              className="w-full md:w-48 h-64 md:h-96 object-cover rounded-sm md:-mt-0"
            />
            {/* Right Image */}
            <img
              src="/images/room2.jpg"
              alt="Resort View"
              className="w-full md:w-48 h-64 md:h-96 object-cover rounded-sm md:mt-8"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 pb-14 md:py-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center font-serif mb-2">
          Our Room
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src="/images/hotel1.jpg"
            alt="Photo 1"
            className="w-full h-[250px] md:h-[400px] object-cover rounded-sm shadow"
          />
          <img
            src="/images/hotel2.jpg"
            alt="Photo 2"
            className="w-full h-[250px] md:h-[400px] object-cover rounded-sm shadow"
          />
          <img
            src="/images/hotel3.jpg"
            alt="Photo 3"
            className="w-full h-[250px] md:h-[400px] object-cover rounded-sm shadow"
          />
          <img
            src="/images/hotel6.jpg"
            alt="Photo 4"
            className="w-full h-[250px] md:h-[400px] object-cover rounded-sm shadow"
          />
        </div>
      </div>

      <div className="w-full bg-white py-12  font-serif px-4 mt-1 md:mt-25">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl text-center font-bold mb-4">Our Offers</h2>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Offer Card 1 */}
            <div className="bg-white  rounded-sm overflow-hidden flex flex-col">
              <img
                src="/images/offer1.jpg"
                alt="Offer 1"
                className="w-full h-[250px] md:h-[350px] object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Up to 35% savings on Club rooms and Suites
                  </h3>
                  <ul className="list-disc list-inside text-medium text-gray-800 mb-4">
                    <li>Luxury conditions</li>
                    <li>3 Adults & 2 Children</li>
                    <li>Sea view side</li>
                  </ul>
                </div>

                <button className="mt-auto bg-black cursor-pointer text-white text-lg text-bold px-4 py-2 rounded-md  transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Offer Card 2 */}
            <div className="bg-white  rounded-sm overflow-hidden flex flex-col">
              <img
                src="/images/offer2.jpg"
                alt="Offer 2"
                className="w-full h-[250px] md:h-[350px] object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Up to 35% savings on Club rooms and Suites
                  </h3>
                  <ul className="list-disc list-inside text-medium text-gray-800 mb-4">
                    <li>Luxury conditions</li>
                    <li>3 Adults & 2 Children</li>
                    <li>Sea view side</li>
                  </ul>
                </div>

                <button className="mt-auto bg-black cursor-pointer text-white text-lg text-bold px-4 py-2 rounded-md  transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Offer Card 3 */}
            <div className="bg-white  rounded-sm overflow-hidden flex flex-col">
              <img
                src="/images/offer3.jpg"
                alt="Offer 3"
                className="w-full h-[250px] md:h-[350px] object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Up to 35% savings on Club rooms and Suites
                  </h3>
                  <ul className="list-disc list-inside text-medium text-gray-800 mb-4">
                    <li>Luxury conditions</li>
                    <li>3 Adults & 2 Children</li>
                    <li>Sea view side</li>
                  </ul>
                </div>

                <button className="mt-auto bg-black cursor-pointer text-white text-lg text-bold px-4 py-2 rounded-md  transition">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="about"
        className="w-full mb-15 mt-0 md:mt-20 flex justify-center bg-white py-12 md:py-20 px-6"
      >
        <div className="max-w-6xl flex flex-col lg:flex-row items-center gap-10 text-center md:text-left">
          {/* Left Column - Text */}
          <div className="flex-1 space-y-4">
            <h4 className="text-lg font-semibold font-serif text-gray-500">
              About Us
            </h4>
            <h2 className="text-4xl font-bold font-serif text-gray-900">
              A Luxurious Hotel <br /> with Nature
            </h2>
            <p className="text-gray-600 font-serif text-lg">
              Suscipit libero pretium nullam potenti. Interdum, blandit
              phasellus consectetuer dolor ornare dapibus enim ut tincidunt
              rhoncus tellus sollicitudin pede nam maecenas, dolor sem. Neque
              sollicitudin enim. Dapibus lorem feugiat facilisi faucibus et.
              Rhoncus.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-md font-semibold cursor-pointer transition">
              Learn More
            </button>
          </div>

          {/* Right Column - Responsive Images */}
          <div className="flex-1 flex flex-col md:flex-row justify-center gap-6 relative w-full">
            {/* Left Image - higher on desktop */}
            <img
              src="/images/hotel-side1.jpg"
              alt="Hotel View 1"
              className="w-full md:w-48 h-64 md:h-96 object-cover rounded-sm md:-mt-0"
            />
            {/* Right Image - lower on desktop */}
            <img
              src="/images/hotel-side2.jpg"
              alt="Hotel View 2"
              className="w-full md:w-48 h-64 md:h-96 object-cover rounded-sm md:mt-8"
            />
          </div>
        </div>
      </div>

      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
