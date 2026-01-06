import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Articles() {
  const navigate = useNavigate();

  // http -> Eksternal dan /../.. -> Internal
  const articles = [
    {
      title: "Pelatihan Internal FCC 2025",
      desc: "Kegiatan pelatihan internal dalam meningkatkan kemampuan tim FCC.",
      link: "/articles/pelatihan-internal",
    },
    {
      title: "Kolaborasi dengan Binus Support",
      desc: "Proses kerja sama FCC dalam meningkatkan sistem dukungan mahasiswa.",
      link: "https://support.binus.ac.id/",
    },
    {
      title: "Workshop Leadership FCC",
      desc: "Kegiatan pengembangan soft skill dan kepemimpinan anggota FCC.",
      link: "/articles/workshop-leadership",
    },
    {
      title: "Event FCC & Student Clubs",
      desc: "Kolaborasi antar organisasi dalam menciptakan komunitas yang inklusif.",
      link: "/articles/event-fcc",
    },
    {
      title: "Rapat Koordinasi Mingguan",
      desc: "Strategi FCC dalam menyusun prioritas dan jadwal kerja.",
      link: "/articles/rapat-koordinasi",
    },
    {
      title: "Sosialisasi Program Baru",
      desc: "Pengenalan inisiatif baru untuk mendukung mahasiswa BINUS.",
      link: "/articles/sosialisasi-program",
    },
    {
      title: "Penerapan Sistem Digitalisasi",
      desc: "Meningkatkan efisiensi kerja tim dengan sistem digital terintegrasi.",
      link: "/articles/digitalisasi",
    },
    {
      title: "FCC Innovation Forum",
      desc: "Sesi berbagi ide dan inovasi antar anggota FCC.",
      link: "/articles/innovation-forum",
    },
    {
      title: "FCC Innovation Forum",
      desc: "Sesi berbagi ide dan inovasi antar anggota FCC.",
      link: "/articles/innovation-forum",
    },
  ];

  // Mendeteksi link eksternal
  const handleClick = (link) => {
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else {
      navigate(link);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Konten utama */}
      <main className="py-24 px-8 text-center bg-gradient-to-b from-yellow-400 to-blue-500 text-black mt-16">
        <h1 className="text-3xl font-bold text-center text-black mb-10">
          FCC Articles
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div
              key={i}
              onClick={() => handleClick(article.link)}
              className="cursor-pointer bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out"
            >
              <h3 className="text-gray-900 font-semibold text-lg mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600">{article.desc}</p>
              <div className="mt-3 text-sm text-yellow-500 font-medium">
                {article.link.startsWith("http")}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
