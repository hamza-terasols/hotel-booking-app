"use client";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  { image: "/images/hotel1.jpg", text: "Welcome to Your Dream Stay" },
  { image: "/images/hotel2.jpg", text: "Experience Comfort Like Never Before" },
  { image: "/images/hotel3.jpg", text: "Relax in Style and Luxury" },
  { image: "/images/hotel4.jpg", text: "Book Your Perfect Vacation" },
  { image: "/images/hotel5.jpg", text: "Make Every Moment Memorable" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="absolute  left-0 w-full h-[40vh]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Centered Text */}
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-white px-6 py-4 text-3xl md:text-5xl font-bold font-serif text-center shadow-lg rounded-md">
              {slide.text}
            </p>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition z-20"
      >
        <FiChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition z-20"
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
}
