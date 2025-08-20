// /app/Signup/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "country-flag-icons/react/3x2"; // For flag icons

export default function SignUpForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Save login info
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.name);
      localStorage.setItem("role", data.role);

      setStatus({ loading: false, error: null, success: true });

      // Redirect to previous checkout page if available
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin"); // clean up
        router.push(redirectUrl);
      } else {
        router.push("/Landing"); // default
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-white bg-no-repeat flex flex-col text-black px-4">
      <div className="flex justify-center items-center pt-10  md:hidden">
        <Link href="/Landing">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-auto h-10 cursor-pointer"
          />
        </Link>
      </div>

      <div className="w-full max-w-[1090px] mx-auto z-1 flex justify-between pt-10">
        {/* Logo Header (Left) */}
        <header className=" hidden md:block  items-center md:items-start space-y-4 w-full md:max-w-[370px] mx-auto">
          <Link href="/Landing">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-auto h-10 cursor-pointer"
            />
          </Link>

          <div className="hidden md:block space-y-5 text-[#21263c] text-sm pt-15 leading-relaxed font-medium">
            <div>
              <h3 className="font-bold text-[22px]">Book Your Stay Easily</h3>
              <p className="text-[16px] font-semibold text-gray-700">
                Browse hotels, compare prices, and reserve your room in just a
                few clicks.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[22px]">
                Flexible Options for Every Traveler
              </h3>
              <p className="text-[16px] font-semibold text-gray-700">
                Choose from budget-friendly rooms, luxury suites, or special
                packages tailored to your needs.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[22px]">
                Trusted by Guests Worldwide
              </h3>
              <p className="text-[16px] font-semibold text-gray-700">
                Millions of travelers rely on our platform to find safe,
                comfortable, and convenient accommodations.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Section */}
        <main className="flex flex-col items-center space-y-6 mt-10 bg-white rounded-xs md:shadow-2xl">
          {/* Heading Section */}
          <div className=" px-20 m-5 w-full">
            <h1 className="text-2xl pt-6 font-extrabold text-black mb-2">
              Create your account
            </h1>

            {/* Form Starts */}
            <form onSubmit={handleFinalSubmit} className="space-y-4 pt-4">
              {/* Full Name */}

              {/* Email */}
              <div className="flex flex-col text-left">
                <label className="text-[14px] text-black font-bold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full text-[18px] border border-gray-300 rounded-sm focus:outline-none focus:border-black px-3 py-2"
                  required
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="text-[14px] text-black font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full text-[18px] border border-gray-300 rounded-sm focus:outline-none focus:border-black px-3 py-2"
                  required
                />
              </div>
              {/* Password */}
              <div className="flex flex-col text-left">
                <label className="text-[14px] text-black font-bold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full text-[18px] border border-gray-300 rounded-sm focus:outline-none focus:border-black px-3 py-2"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 text-left">
                <input
                  type="checkbox"
                  id="isAdmin"
                  className="w-4 h-4 rounded border border-gray-400 text-white bg-black checked:bg-black focus:ring-0"
                  checked={formData.role === "admin"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.checked ? "admin" : "user",
                    })
                  }
                />
                <label
                  htmlFor="isAdmin"
                  className="text-gray-700 font-bold text-sm cursor-pointer"
                >
                  Register as <span className="text-blue-600">Admin</span>
                </label>
              </div>

              {/* Status Messages */}
              {status.success && (
                <div className="text-green-600 text-sm">
                  Account created successfully!
                </div>
              )}
              {status.error && (
                <div className="text-red-600 text-sm">{status.error}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.loading}
                className={`w-full bg-[#000000] rounded-sm text-medium font-bold text-white py-2 cursor-pointer transition ${
                  status.loading && "opacity-50 cursor-not-allowed"
                }`}
              >
                {status.loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}

            {/* Sign in with Apple */}
          </div>

          {/* Footer Note */}
          <div className="text-center bg-[#f6f9fc] w-[350px] md:w-[540px] mb-1 py-4 rounded-md">
            <p className="text-sm text-gray-600">
              Already have an account ?{" "}
              <a
                href="/Login"
                className="text-black hover:text-[#444a5e] font-bold text-[15px] hover:underline"
              >
                Sign in{" "}
              </a>
            </p>
          </div>
        </main>
      </div>

      <div
        className="absolute hidden md:block bottom-0 left-0 w-full h-[40vh] bg-cover   bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundPosition: "center 45%",
        }}
      ></div>
    </div>
  );
}
