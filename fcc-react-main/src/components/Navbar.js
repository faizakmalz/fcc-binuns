import React from "react";
import { Link, useLocation } from "react-router-dom";
import binusLogo from "../Assets/Logo-Binus.png";
import fccLogo from "../Assets/Logo-FCC.png";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-white shadow-md fixed w-full top-0 z-20">

      {/* Logo FCC dan Binus di pojok kiri atas */}
      <div className="flex items-center gap-4">
        <img
          src={binusLogo}
          alt="Binus Logo"
          className="h-20 w-auto"
        />
        <div className="w-[2px] h-10 bg-gray-300" />
        <div className="flex items-center gap-3">
          <img
            src={fccLogo}
            alt="FCC Logo"
            className="w-10 h-12 rounded-full object-cover"
          />
          <div className="text-lg font-bold text-gray-800">Friends Care Community</div>
        </div>
      </div>

      {/* Menu/fitur di posisi tengah */}
      <div className="flex gap-6 text-gray-700 font-medium">
        <Link
          to="/"
          className={`hover:text-blue-600 ${
            location.pathname === "/" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/articles"
          className={`hover:text-blue-600 ${
            location.pathname === "/articles" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          Articles
        </Link>
        <Link
          to="/documents"
          className={`hover:text-blue-600 ${
            location.pathname === "/documents" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          Documents
        </Link>
        <Link
          to="/contact"
          className={`hover:text-blue-600 ${
            location.pathname === "/contact" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          Contact Us
        </Link>
      </div>

      {/* Login & Register di pojok kanan atas */}
      <div className="flex gap-3">
        <Link
          to="/login"
          className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-black hover:text-white transition"
        >
          Login / Register
        </Link>
      </div>
    </nav>
  );
}
