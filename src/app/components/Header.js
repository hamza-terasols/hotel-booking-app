"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdMenu, IoMdClose } from "react-icons/io";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUser({
          name: userObj.name || storedUser,
          role: storedRole || "user",
        });
      } catch {
        setUser({
          name: storedUser,
          role: storedRole || "user",
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/Landing");
    setDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white px-6 py-3 shadow">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between relative">
        {/* Left (Desktop Nav) */}
        <nav className="hidden md:flex space-x-6 text-black text-lg font-serif">
          <Link href="/Landing">Home</Link>

          {user?.role === "admin" ? (
            <>
              <Link href="/HotelManagement">Dashboard</Link>
              <Link href="/rooms">Rooms</Link>
              <Link href="/BookedHotels">Record</Link>
              <Link href="/Landing#about">About Us</Link>
              <Link href="/Landing#footer">Contact Us</Link>
            </>
          ) : (
            <>
              <Link href="/rooms">Rooms</Link>
              <Link href="/bookings">Bookings</Link>
              <Link href="/Landing#about">About Us</Link>
              <Link href="/Landing#footer">Contact Us</Link>
            </>
          )}
        </nav>

        {/* Left (Mobile Hamburger) */}
        <button
          className="md:hidden text-2xl text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/Landing">
            <img
              src="/images/logo.png"
              alt="Hotel Logo"
              className="md:h-10 h-7"
            />
          </Link>
        </div>

        {/* Right: Auth/User */}
        <div className="flex space-x-4 items-center relative">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-2 py-1 capitalize cursor-pointer text-black font-semibold rounded-md hover:bg-gray-100 transition"
              >
                {user.name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/Login"
                className="hidden md:inline px-2 py-2 font-serif text-lg rounded transition"
              >
                Login
              </Link>
              <Link
                href="/Signup"
                className="hidden md:inline px-2 py-2 font-serif text-lg rounded transition"
              >
                Signup
              </Link>
            </>
          )}

          {user?.role === "user" && (
            <Link
              href="/rooms"
              className="hidden md:inline px-3 py-1 mt-1 text-medium bg-black text-white font-bold rounded-md transition"
            >
              Book A Room
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/HotelManagement"
              className="hidden md:inline px-3 py-1 mt-1 text-medium bg-black text-white font-bold rounded-md transition"
            >
              Add Room
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-6">
          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="self-end text-3xl font-bold text-black"
          >
            ✕
          </button>

          {/* Navigation */}
          <nav className="mt-6 flex flex-col space-y-4 text-black text-lg font-serif">
            <Link
              href="/Landing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-medium"
            >
              Home
            </Link>

            {user?.role === "admin" ? (
              <>
                <Link
                  href="/HotelManagement"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/rooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Rooms
                </Link>
                <Link
                  href="/BookedHotels"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Record
                </Link>
                <Link
                  href="/Landing#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  About Us
                </Link>
                <Link
                  href="/Landing#footer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/rooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Rooms
                </Link>
                <Link
                  href="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Bookings
                </Link>
                <Link
                  href="/Landing#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  About Us
                </Link>
                <Link
                  href="/Landing#footer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Contact Us
                </Link>
              </>
            )}

            {/* Mobile Auth */}
            {!user && (
              <>
                <Link
                  href="/Login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium"
                >
                  Login
                </Link>
              </>
            )}

            {/* Mobile CTA */}
            {user?.role === "user" && (
              <Link
                href="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 bg-black text-white font-bold rounded-md text-xl"
              >
                Book A Room
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/HotelManagement"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 bg-black text-white font-bold rounded-md text-xl"
              >
                Add Room
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
