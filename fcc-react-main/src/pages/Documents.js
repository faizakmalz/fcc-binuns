import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import temanNgumpulImg from "../Assets/Teman-Ngumpul.jpg";

export default function Documents() {
  const [openIndex, setOpenIndex] = useState(null);

  const documents = [
    {
      title: "Pelatihan Internal FCC 2025",
      desc: "Pelatihan rutin untuk meningkatkan kemampuan tim FCC dalam bidang teknis dan manajerial.",
      detail:
        "Pelatihan ini berfokus pada peningkatan kemampuan manajemen proyek, komunikasi antar anggota tim, serta penguasaan teknologi baru seperti AI tools dan manajemen server.",
    },
    {
      title: "Kolaborasi dengan Binus Support",
      desc: "Kerja sama dengan Binus Support untuk meningkatkan sistem dukungan mahasiswa.",
      detail:
        "Melalui kolaborasi ini, FCC dan Binus Support mengembangkan sistem berbasis teknologi untuk membantu mahasiswa lebih mudah mendapatkan dukungan akademik dan non-akademik.",
    },
    {
      title: "Penerapan Sistem Dokumentasi Terintegrasi",
      desc: "Inovasi baru FCC dalam menyatukan seluruh dokumentasi ke dalam satu portal modern.",
      detail:
        "Portal ini mengintegrasikan seluruh arsip kegiatan FCC, laporan proyek, dan dokumentasi visual agar dapat diakses dengan cepat oleh seluruh anggota tim.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
    {
      title: "Gathering Komunitas FCC 2025",
      desc: "Acara kebersamaan anggota FCC untuk mempererat hubungan dan kolaborasi lintas divisi.",
      detail:
        "Kegiatan ini melibatkan sharing session, game interaktif, serta pembahasan ide proyek yang akan dijalankan di semester berikutnya.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="py-24 px-8 text-center bg-gradient-to-b from-yellow-400 to-blue-500 text-black mt-16">
        <h1 className="text-3xl font-bold mb-10">FCC Documents</h1>

        {/* Kotak (beberapa kolom) */}
        <div className="max-w-17xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl shadow-md p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={temanNgumpulImg}
                alt={doc.title}
                className="rounded-lg w-full h-36 object-cover mb-4"
              />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {doc.title}
              </h3>
              <p className="text-gray-700 mb-4">{doc.desc}</p>
              <button
                onClick={() => setOpenIndex(i)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Detail
              </button>
            </div>
          ))}
        </div>

        {/* Animasi dalam "Detail" dan "Tutup" */}
        <AnimatePresence>
          {openIndex !== null && (
            <motion.div
              key="modal"
              className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-5xl w-[90%] p-10 relative overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Gambar di dalam kotak */}
                <img
                  src={temanNgumpulImg}
                  alt={documents[openIndex].title}
                  className="rounded-xl w-full h-80 object-cover mb-6"
                />

                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                  {documents[openIndex].title}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
                  {documents[openIndex].detail}
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => setOpenIndex(null)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
