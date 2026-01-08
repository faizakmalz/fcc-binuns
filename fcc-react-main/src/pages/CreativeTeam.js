import React, { useState, useEffect } from "react";
import { User, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getCreativeLogbookByUserId,
  getCreativeLogbookFiltered,
  saveCreativeLogbook,
  deleteCreativeLogbookEntry,
  getEvaluationsByRole,
  getQuestionnairesByRole,
  getCreativeTeamByUserId,
  getCreativeLogbookByUsername,
  getPembinaById
} from "../utils/supabaseHelpers";

export default function CreativeTeam() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser?.id; // Supabase user ID
  const loggedInUsername = currentUser?.username;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topik: "",
    tanggalDiskusi: "",
    mediaDiskusi: "",
    hasilDiskusi: "",
    status: "",
    linkIG: "",
  });

  const [dataCreative, setDataCreative] = useState([]);
  const [roleData, setRoleData] = useState(JSON.parse(localStorage.getItem("roleData")) || null);
  const [activePage, setActivePage] = useState("dashboard");
  const [showUploadLink, setShowUploadLink] = useState(false);
  const [evaluation, setEvaluation] = useState({ evaluations: [], questionnaires: [] });
  const [pembina, setPembina] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadAllData();
      getPembina();
    }
  }, []);

  const getPembina = async () => {
    const pembinaData = await getPembinaById(roleData?.pembina || null);
    console.log("Pembina data fetched:", pembinaData, roleData);
    setPembina(pembinaData?.data || {});
  }
  console.log("Fetched pembina data:", pembina);


  const loadAllData = async () => {
    setLoading(true);
    try {
      const logbookData = await getCreativeLogbookByUsername(currentUser?.username);
     
        if (logbookData.success) {
          setDataCreative(logbookData.data || []);
        }

      await loadEvaluationsAndQuestionnaires();

    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message
      });
    }
    setLoading(false);
  };

  const loadEvaluationsAndQuestionnaires = async () => {
    try {
      const evalResult = await getEvaluationsByRole("Creative Team");
      const questResult = await getQuestionnairesByRole("Creative Team");

      setEvaluation({
        evaluations: evalResult.success ? evalResult.data : [],
        questionnaires: questResult.success ? questResult.data : []
      });
    } catch (error) {
      console.error("Error loading evaluations:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "status") setShowUploadLink(value === "Final");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["topik", "tanggalDiskusi", "mediaDiskusi", "hasilDiskusi", "status"];
    const empty = requiredFields.filter((f) => !formData[f]);
    
    if (empty.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Harap isi semua kolom!",
      });
      return;
    }

    if (formData.status === "Final" && !formData.linkIG) {
      Swal.fire({
        icon: "warning",
        title: "Link belum diisi",
        text: "Silakan masukkan link Instagram untuk status Final",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menyimpan logbook ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const logbookData = {
        username: loggedInUsername,
        topik: formData.topik,
        tanggal_diskusi: formData.tanggalDiskusi,
        media_diskusi: formData.mediaDiskusi,
        hasil_diskusi: formData.hasilDiskusi,
        status: formData.status,
        link_ig: formData.linkIG || "",
        periode: roleData?.periode || "",
        pembina: roleData?.pembina_id || "",
        status_verifikasi: formData.statusVerifikasi || "Menunggu",
        komentar_staff: formData.komentarStaff || "",
      };
      console.log("Submitting logbook data:", logbookData);
      const saveResult = await saveCreativeLogbook(logbookData);

      if (saveResult.success) {
        await loadAllData(); 

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Data logbook berhasil ${saveResult.isUpdate ? "diupdate" : "disimpan"}`,
        });

        setFormData({
          topik: "",
          tanggalDiskusi: "",
          mediaDiskusi: "",
          hasilDiskusi: "",
          status: "",
          linkIG: "",
        });
        setShowUploadLink(false);
      } else {
        throw new Error(saveResult.error);
      }
    } catch (error) {
      console.error("Error saving logbook:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.message
      });
    }

    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      topik: item.topik,
      tanggalDiskusi: item.tanggal_diskusi,
      mediaDiskusi: item.media_diskusi,
      hasilDiskusi: item.hasil_diskusi,
      status: item.status,
      linkIG: item.link_ig || "",
      statusVerifikasi: "Menunggu",
      komentarStaff: "",
    });

    setShowUploadLink(item.status === "Final");

    Swal.fire({
      icon: "info",
      title: "Mode Edit",
      text: "Silakan ubah data dan klik Simpan untuk memperbarui logbook.",
      timer: 2000
    });
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Hapus Logbook?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626"
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const deleteResult = await deleteCreativeLogbookEntry(item.id);
      
      if (deleteResult.success) {
        await loadAllData();
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Logbook berhasil dihapus",
          timer: 2000
        });
      } else {
        throw new Error(deleteResult.error);
      }
    } catch (error) {
      console.error("Error deleting logbook:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-700 font-medium">Loading...</p>
            </div>
          </div>
        </div>
      )}

      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Creative Team</h2>
        <ul className="space-y-3 text-gray-700">
          <li
            onClick={() => setActivePage("dashboard")}
            className={`cursor-pointer font-semibold ${
              activePage === "dashboard" ? "text-blue-600" : "hover:text-blue-500"
            }`}
          >
            Dashboard
          </li>
          <li
            onClick={() => setActivePage("evaluasi-kuesioner")}
            className={`cursor-pointer font-semibold ${
              activePage === "evaluasi-kuesioner" ? "text-blue-600" : "hover:text-blue-500"
            }`}
          >
            Evaluasi dan Kuesioner
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8 w-full">
          <button
            onClick={() => navigate("/role-selection")}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Kembali
          </button>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <User className="text-gray-700" />
              <div>
                <p className="font-semibold text-gray-800">
                  {currentUser?.nama || "Nama"}
                </p>
                <p className="text-sm text-gray-600">
                  {currentUser?.nim || "NIM"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-900 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {roleData && (
          <div className="mb-6 p-3 rounded-lg bg-blue-100 border border-blue-300 max-w-lg">
            <p className="font-semibold text-gray-800">
              Periode: <span className="font-normal">{roleData.periode || "-"}</span>
            </p>
            <p className="font-semibold text-gray-800">
              Pembina: <span className="font-normal">{pembina.nama || "-"}</span>
            </p>
          </div>
        )}

        {activePage === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Logbook Kegiatan</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Topik</label>
                  <input
                    type="text"
                    name="topik"
                    value={formData.topik}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Masukkan topik diskusi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Diskusi</label>
                  <input
                    type="date"
                    name="tanggalDiskusi"
                    value={formData.tanggalDiskusi}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Media Diskusi</label>
                  <select
                    name="mediaDiskusi"
                    value={formData.mediaDiskusi}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                  >
                    <option value="">Pilih media</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Chat WA/Line">Chat WA/Line</option>
                    <option value="Email">Email</option>
                    <option value="Tatap Muka">Tatap muka</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hasil Diskusi</label>
                  <textarea
                    name="hasilDiskusi"
                    value={formData.hasilDiskusi}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    rows="3"
                    placeholder="Tuliskan hasil diskusi..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                  >
                    <option value="">Pilih status</option>
                    <option value="On Progress">On Progress</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                {showUploadLink && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Link</label>
                    <input
                      type="url"
                      name="linkIG"
                      value={formData.linkIG}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {loading ? "Menyimpan..." : formData.id ? "Update" : "Simpan"}
                </button>
              </div>
            </form>

            <h2 className="text-lg font-bold mb-4 text-gray-800">Data Logbook</h2>
            <div className="bg-white rounded-xl shadow overflow-auto" style={{ maxHeight: "400px" }}>
              {dataCreative.length === 0 ? (
                <p className="text-gray-500 p-4">Belum ada data logbook.</p>
              ) : (
                <table className="min-w-full text-left text-sm border-collapse">
                  <thead className="sticky top-0 bg-gray-200 z-10 shadow">
                    <tr className="border-b">
                      <th className="py-2 px-3 text-center">Topik</th>
                      <th className="py-2 px-3 text-center">Tanggal</th>
                      <th className="py-2 px-3 text-center">Media</th>
                      <th className="py-2 px-3 text-center">Hasil</th>
                      <th className="py-2 px-3 text-center">Status</th>
                      <th className="py-2 px-3 text-center">Link</th>
                      <th className="py-2 px-3 text-center">Verifikasi</th>
                      <th className="py-2 px-3 text-center">Komentar</th>
                      <th className="py-2 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCreative.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-center">{item.topik}</td>
                        <td className="py-2 px-3 text-center">{item.tanggal_diskusi}</td>
                        <td className="py-2 px-3 text-center">{item.media_diskusi}</td>
                        <td className="py-2 px-3 text-center">{item.hasil_diskusi}</td>
                        <td className="py-2 px-3 text-center">{item.status}</td>
                        <td className="py-2 px-3 text-center">
                          {item.link_ig ? (
                            <a
                              href={item.link_ig}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Link
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status_verifikasi === "Disetujui"
                                ? "bg-green-100 text-green-700"
                                : item.status_verifikasi === "Tidak Disetujui"
                                ? "bg-red-100 text-red-700"
                                : item.status_verifikasi === "Decline (Edit Ulang)"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status_verifikasi || "Menunggu"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">{item.komentar_staff || "-"}</td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex gap-2 justify-center">
                            {(item.status_verifikasi === "Menunggu" || item.status_verifikasi === "Decline (Edit Ulang)") && (
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-xs"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activePage === "evaluasi-kuesioner" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Evaluasi & Kuesioner</h2>

            <div className="space-y-8">
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Evaluasi</h3>
                {evaluation.evaluations.length === 0 ? (
                  <p className="text-gray-500">Belum ada evaluasi.</p>
                ) : (
                  <div className="space-y-4">
                    {evaluation.evaluations.map((item, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <h4 className="font-semibold">{item.title}</h4>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Buka Form
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Kuesioner</h3>
                {evaluation.questionnaires.length === 0 ? (
                  <p className="text-gray-500">Belum ada kuesioner.</p>
                ) : (
                  <div className="space-y-4">
                    {evaluation.questionnaires.map((item, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <h4 className="font-semibold">{item.title}</h4>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Buka Form
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}