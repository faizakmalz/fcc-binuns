import React from "react";
import { Link } from "react-router-dom";
import temanNgumpul from "../Assets/Teman-Ngumpul.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Background (slogan) */}
      <main
        className="flex-grow relative text-white pt-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${temanNgumpul})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center p-6 min-h-[80vh]">
          <h1 className="text-5xl font-bold mb-3">Welcome to FCC</h1>
          <p className="text-lg text-gray-100 max-w-xl">
            Together We Care, Together We Grow
          </p>
        </div>
      </main>

      {/* Artikel (halaman Home) */}
      <section className="bg-gray-50 py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          Artikel
        </h2>

        <div className="max-w-6xl text-center mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Pelatihan Internal FCC 2025",
            },
            {
              title: "Kolaborasi dengan Binus Support",
            },
            {
              title: "Workshop Leadership FCC",
            },
            {
              title: "Event FCC & Student Clubs",
            },
            {
              title: "Rapat Koordinasi Mingguan",
            },
            {
              title: "Sosialisasi Program Baru",
            },
            {
              title: "Penerapan Sistem Digitalisasi",
            },
            {
              title: "FCC Innovation Forum",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              <h3 className="text-gray-900 font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}

          {/* Fitur/menu lihat selengkapnya */}
          <div className="flex items-center justify-center bg-white-400 rounded-xl border border-gray-200 p-6 hover:bg-cyan-500 transition duration-300">
            <Link
              to="/articles"
              className="text-black font-semibold text-lg hover:text-white transition"
            >
              Lihat Selengkapnya →
            </Link>
          </div>
        </div>
      </section>

      {/* Dokumentasi (halaman Home) */}
      <section className="bg-gradient-to-b from-cyan-500 to-blue-100 text-yellow-400 py-16 px-3">
        <h2 className="text-3xl font-semibold text-center mb-9">
          Dokumentasi Proses Kerja
        </h2>

        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto mb-8">
          {[
            {
              title: "Rapat Koordinasi Mingguan",
              desc: "Kegiatan rutin FCC dalam menyusun strategi kerja mingguan.",
              img: temanNgumpul,
            },
            {
              title: "Diskusi Ide Proyek",
              desc: "Tim FCC berdiskusi untuk merancang proyek-proyek kreatif.",
              img: temanNgumpul,
            },
            {
              title: "Kegiatan Sosialisasi",
              desc: "Sesi berbagi pengalaman antar anggota FCC dan mahasiswa.",
              img: temanNgumpul,
            },
          ].map((doc, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden w-full"
            >
              <img
                src={doc.img}
                alt={doc.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
                <p className="text-gray-700">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/documents"
            className="inline-block text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
