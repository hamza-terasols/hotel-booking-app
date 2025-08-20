import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  // Track which accordion is open on mobile
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const footerColumns = [
    {
      title: "Hotel",
      content: (
        <>
          <p className="text-medium mb-1">Mian Mehmood Ali Kasoori Rd,</p>
          <p className="text-medium mb-1">Gulberg III, Lahore, Punjab</p>
          <p className="text-medium mb-1">+92 42 111 000 777</p>
          <p className="text-medium">info@hotel.com</p>
        </>
      ),
    },
    {
      title: "Hotel Johar Town",
      content: (
        <>
          <p className="text-medium mb-1">
            Adjacent to CoForGood, Commercial Area
          </p>
          <p className="text-medium mb-1">Lahore, Punjab</p>
          <p className="text-medium mb-1">+92 42 111 646 835</p>
          <p className="text-medium mb-1">reservationsj@hotel.com</p>
          <p className="text-medium">localhost@hotel.com</p>
        </>
      ),
    },
    {
      title: "Connect With Us",
      content: (
        <div className="flex flex-col space-y-2">
          <a href="#" className="flex items-center space-x-2 hover:text-white">
            <FaFacebookF /> <span>Facebook</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-white">
            <FaInstagram /> <span>Instagram</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-white">
            <FaYoutube /> <span>Youtube</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-white">
            <FaLinkedin /> <span>Linkedin</span>
          </a>
        </div>
      ),
    },
    {
      title: "Quick Links",
      content: (
        <ul className="space-y-2">
          <li>
            <a href="#" className="hover:text-white">
              Rooms
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Packages
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Blogs
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <footer className="w-full bg-black text-white font-serif py-10 md:py-42 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {footerColumns.map((col, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-xl mb-4">{col.title}</h3>
              {col.content}
            </div>
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden flex flex-col space-y-2">
          {footerColumns.map((col, idx) => (
            <div key={idx} className="border-b border-gray-700">
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left py-3 flex justify-between items-center font-bold text-lg"
              >
                {col.title}
                <span className="text-xl">{openIndex === idx ? "-" : "+"}</span>
              </button>
              {openIndex === idx && (
                <div className="pb-3 text-medium">{col.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
