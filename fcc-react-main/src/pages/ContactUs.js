import React from "react";
import Navbar from "../components/Navbar";
import admissionImg from "../Assets/BinusSupport_Admission.jpg";
import binusianImg from "../Assets/BinusSupport_Binusian.jpg";
import Footer from "../components/Footer";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />

      {/* Header Section */}
      <section className="h-[40vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-yellow-400 text-white shadow-md">
        <h1 className="text-4xl font-bold">Contact Us</h1>
      </section>

      {/* Konten Utama */}
      <section className="flex flex-col items-center py-12 px-6 bg-white">
        {/* Admission */}
        <div className="max-w-4xl mb-12 text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">Admission</h2>
          <p className="text-gray-700 mb-4">
            Mendukung proses penerimaan dan informasi mahasiswa baru di BINUS University.  
            Tim Admission siap membantu kamu mengenal lebih dekat dunia BINUS!
          </p>
          <img
            src={admissionImg}
            alt="Binus Support Admission"
            className="rounded-2xl shadow-lg w-full object-cover mb-4"
          />
        </div>

        {/* Binusian*/}
        <div className="max-w-4xl mb-12 text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">Binusian</h2>
          <p className="text-gray-700 mb-4">
            Didedikasikan untuk mendukung mahasiswa aktif BINUS dalam akademik, kegiatan, dan pengembangan diri.
          </p>
          <img
            src={binusianImg}
            alt="Binusian Support"
            className="rounded-2xl shadow-lg w-full object-cover mb-4"
          />
        </div>
      </section>
      <Footer/>
    </div>
  );
}
