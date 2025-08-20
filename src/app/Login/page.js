// /app/Login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdOutlineLock } from "react-icons/md";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.name);
      localStorage.setItem("role", data.user.role);

      setStatus({ loading: false, error: null, success: true });

      // Redirect to previous checkout page if available
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin"); // Clean up
        router.push(redirectUrl);
      } else {
        router.push("/Landing"); // Default redirect
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <div className="flex flex-col bg-white text-black   md:px-4 min-h-screen ">
      {/* Header */}
      <header className="w-full flex justify-center md:justify-start items-center max-w-[1090px] px-6 py-6 mx-auto">
        <Link href="/Landing">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-auto h-10 cursor-pointer"
          />
        </Link>
      </header>

      {/* Background Image Section at bottom */}

      <div className="flex flex-col z-1 items-center pt-10 space-y-10">
        {/* Header: Logo */}

        {/* Main Content */}
        <main className="flex flex-col  items-center space-y-10 bg-white  rounded-xs md:shadow-lg">
          {/* Wider Heading */}

          {/* Login Form */}
          <div className="w-full px-5  md:px-17 mx-5 md:m-10">
            <h1 className="text-3xl font-extrabold text-black mb-2">
              Sign in to your account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              {/* Email Field */}
              <div className="flex flex-col text-left">
                <label className="text-[15px] text-black font-bold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full text-[18px] border border-gray-300 rounded-sm focus:outline-none focus:border-black px-3 py-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col text-left">
                <label className="text-[15px] text-black font-bold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border text-[18px] border-gray-300 rounded-sm focus:outline-none focus:border-black px-3 py-2"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* Status Messages */}
              {status.error && (
                <div className="text-red-600">{status.error}</div>
              )}
              {status.success && (
                <div className="text-green-600">Login successful!</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.loading}
                className={`w-full bg-black rounded-sm text-medium font-bold text-white py-2 cursor-pointer  transition ${
                  status.loading && "opacity-50 cursor-not-allowed"
                }`}
              >
                {status.loading
                  ? "Logging in..."
                  : showPassword
                  ? "Login"
                  : "Sign in "}
              </button>
            </form>
          </div>
          <div className="text-center bg-[#f6f9fc] w-[350px] md:w-[540px] mb-1 py-4  rounded-md">
            <p className="text-sm  text-gray-600">
              <a
                href="/Signup"
                className="text-black hover:text-[#444a5e] font-bold  text-[17px] hover:underline"
              >
                Create account
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
