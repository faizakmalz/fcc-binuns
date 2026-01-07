import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { User, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAllStudentAccounts,
  createStudentAccount,
  deleteStudentAccount,
  getAllPembina,
  createPembina,
  deletePembina,
  getRoleDataByType,
  createRoleData,
  deleteRoleData,
  updateSouvenirStatus,
  getAllBuddy,
  createBuddy,
  deleteBuddy,
  getAllCounselorLogbook,
  updateCounselorLogbook,
  getAllPartnerLogbook,
  updatePartnerLogbook,
  getAllCreativeLogbook,
  updateCreativeLogbook,
  getEvaluationsByRole,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getQuestionnairesByRole,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  updateBuddy,
  updateUserRole,
  updateCounselorData,
  updatePartnerData,
} from "../utils/supabaseHelpers";

export default function SASCStaff() {
  const [activePage, setActivePage] = useState("pembina");
  const [loading, setLoading] = useState(false);
  const [searchPeriode, setSearchPeriode] = useState("");
  const [searchNama, setSearchNama] = useState("");
  const [searchNamaStudent, setSearchNamaStudent] = useState("");
  const [searchPembina, setSearchPembina] = useState("");
  const [searchBuddy, setSearchBuddy] = useState("");
  const [searchSouvenirPeriode, setSearchSouvenirPeriode] = useState("");
  const [searchSouvenirNim, setSearchSouvenirNim] = useState("");
  const [searchSouvenirArea, setSearchSouvenirArea] = useState("");

  const [showEditCounselorModal, setShowEditCounselorModal] = useState(false);
const [showDetailCounselorModal, setShowDetailCounselorModal] = useState(false);
const [editingCounselor, setEditingCounselor] = useState(null);
const [selectedCounselorDetail, setSelectedCounselorDetail] = useState(null);
const [filterCounselorArea, setFilterCounselorArea] = useState("");
const [filterCounselorPeriode, setFilterCounselorPeriode] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
const [showBuddyModal, setShowBuddyModal] = useState(false);
const [editingPartner, setEditingPartner] = useState(null);
const [selectedPartner, setSelectedPartner] = useState(null);
const [currentBuddy, setCurrentBuddy] = useState(null);
const [selectedBuddyNim, setSelectedBuddyNim] = useState("");
const [buddyModalMode, setBuddyModalMode] = useState(null); 

  const [pembinaList, setPembinaList] = useState([]);
  const [studentAccounts, setStudentAccounts] = useState([]);
  const [dataInputCounselor, setDataInputCounselor] = useState([]);
  const [dataInputPartner, setDataInputPartner] = useState([]);
  const [dataInputCreativeTeam, setDataInputCreativeTeam] = useState([]);
  const [dataBuddy, setDataBuddy] = useState([]);
  const [dataCounselor, setDataCounselor] = useState([]);
  const [dataPartner, setDataPartner] = useState([]);
  const [dataCreative, setDataCreative] = useState([]);

  const [formPembina, setFormPembina] = useState({ nama: "", binusianId: "", area: "", pic: "" });
  const [formBuddy, setFormBuddy] = useState({ nim: "", nama: "", jurusan: "", partnerNim: "", roleNim: "", roleType: "" });
  const [formStudentLogin, setFormStudentLogin] = useState({ username: "", password: "", nim: "", nama: "" });
  const [formCounselor, setFormCounselor] = useState({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
  const [formPartner, setFormPartner] = useState({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
  const [formCreativeTeam, setFormCreativeTeam] = useState({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });

  const [evalData, setEvalData] = useState({ evaluations: [], questionnaires: [] });
  const [inputEval, setInputEval] = useState({ title: "", link: "", role: "" });
  const [inputKues, setInputKues] = useState({ title: "", link: "", role: "" });
  const [editIndexEval, setEditIndexEval] = useState(null);
  const [editIndexKues, setEditIndexKues] = useState(null);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [riwayat, setRiwayat] = useState([]);
  const [searchCounselor, setSearchCounselor] = useState("");
  const [searchPartner, setSearchPartner] = useState("");
  const [searchCreativeTeam, setSearchCreativeTeam] = useState("");

  const [notif, setNotif] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const pembinaRes = await getAllPembina();
      if (pembinaRes.success) {
        setPembinaList(pembinaRes.data.map(p => ({
          nama: p.nama,
          binusianId: p.binusian_id,
          area: p.area,
          pic: p.pic
        })));
      }

      const studentsRes = await getAllStudentAccounts();
      if (studentsRes.success) setStudentAccounts(studentsRes.data);

      const counselorRes = await getRoleDataByType("Peer Counselor");
      if (counselorRes.success) setDataInputCounselor(counselorRes.data);

      const partnerRes = await getRoleDataByType("Peer Partner");
      if (partnerRes.success) setDataInputPartner(partnerRes.data);

      const creativeRes = await getRoleDataByType("Creative Team");
      if (creativeRes.success) setDataInputCreativeTeam(creativeRes.data);

      const buddyRes = await getAllBuddy();
      if (buddyRes.success) {
        setDataBuddy(buddyRes.data
          .filter(b => b.nim)  
          .map(b => ({
          nim: b.nim,
          nama: b.nama,
          jurusan: b.jurusan,
          partnerNim: b.partner_nim,
          partnerNama: b.partner_nama,
          pendampingNim: b.pendamping_nim,
          pendampingNama: b.pendamping_nama,
          pendampingRole: b.pendamping_role
        })));
      }

      const counselorLogRes = await getAllCounselorLogbook();
      if (counselorLogRes.success) {
        setDataCounselor(counselorLogRes.data.map(item => ({
          ...item,
          status: item.status || "Menunggu",
          komentarStaff: item.komentar_staff || "",
          tanggalKonseling: item.tanggal_konseling,
          jamMulai: item.jam_mulai,
          jamSelesai: item.jam_selesai,
          kampusArea: item.kampus_area,
          supportNeeded: item.support_needed,
          statusCase: item.status_case
        })));
      }

      const partnerLogRes = await getAllPartnerLogbook();
      if (partnerLogRes.success) {
        setDataPartner(partnerLogRes.data.map(item => ({
          ...item,
          status: item.status || "Menunggu",
          komentarStaff: item.komentar_staff || "",
          nimBuddy: item.nim_buddy,
          namaBuddy: item.nama_buddy,
          partnerNama: item.partner_nama,
          pendampingNama: item.pendamping_nama,
          pendampingRole: item.pendamping_role,
          jamMulai: item.jam_mulai,
          jamSelesai: item.jam_selesai,
          tanggal: item.tanggal
        })));
      }

      const creativeLogRes = await getAllCreativeLogbook();
      if (creativeLogRes.success) {
        setDataCreative(creativeLogRes.data.map(item => ({
          ...item,
          statusVerifikasi: item.status_verifikasi || "Menunggu",
          komentarStaff: item.komentar_staff || "",
          tanggalDiskusi: item.tanggal_diskusi,
          mediaDiskusi: item.media_diskusi,
          hasilDiskusi: item.hasil_diskusi,
          linkIG: item.link_ig
        })));
      }

      await loadEvaluationsAndQuestionnaires();
    } catch (error) {
      console.error("Error loading data:", error);
      showNotif("Gagal memuat data", "error");
    }
    setLoading(false);
  };

  const loadEvaluationsAndQuestionnaires = async () => {
    const allEvals = [];
    const allQuests = [];
    for (const role of ["Peer Counselor", "Peer Partner", "Creative Team"]) {
      const evalRes = await getEvaluationsByRole(role);
      if (evalRes.success) allEvals.push(...evalRes.data);
      const questRes = await getQuestionnairesByRole(role);
      if (questRes.success) allQuests.push(...questRes.data);
    }
    setEvalData({ evaluations: allEvals, questionnaires: allQuests });
  };

  const showNotif = (message, type = "info") => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif({ show: false, message: "", type: "" }), 2000);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // PEMBINA
  const handleAddPembina = async (e) => {
    e.preventDefault();
    if (!formPembina.nama.trim() || !formPembina.binusianId.trim()) {
      showNotif("Nama dan Binusian ID wajib diisi!", "error");
      return;
    }
    const confirm = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah data pembina sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await createPembina(
      formPembina.nama.trim(),
      formPembina.binusianId.trim(),
      formPembina.area.trim(),
      formPembina.pic.trim()
    );
    if (result.success) {
      await loadAllData();
      setFormPembina({ nama: "", binusianId: "", area: "", pic: "" });
      showNotif("Pembina berhasil ditambahkan!", "success");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleDeletePembina = async (binusianId) => {
    const confirm = await Swal.fire({
      title: "Hapus Pembina?",
      text: "Data pembina yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await deletePembina(binusianId);
    if (result.success) {
      await loadAllData();
      showNotif("Pembina dihapus!", "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // STUDENT ACCOUNT
  const handleAddStudentAccount = async (e) => {
    e.preventDefault();
    if (!formStudentLogin.username || !formStudentLogin.password || 
        !formStudentLogin.nim || !formStudentLogin.nama) {
      Swal.fire("Error", "Semua kolom wajib diisi", "error");
      return;
    }
    const confirm = await Swal.fire({
      title: "Informasi Akun Student",
      html: `<p>Akun ini akan digunakan oleh <b>student</b> untuk login.</p><p>Pastikan <b>username dan password</b> sudah benar.</p>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Simpan Akun",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await createStudentAccount(
      formStudentLogin.username,
      formStudentLogin.password,
      formStudentLogin.nim,
      formStudentLogin.nama
    );
    if (result.success) {
      await loadAllData();
      setFormStudentLogin({ username: "", password: "", nim: "", nama: "" });
      Swal.fire({ icon: "success", title: "Berhasil", text: "Akun student berhasil ditambahkan", timer: 2000, showConfirmButton: false });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleDeleteStudent = async (id, roleId) => {
    console.log("=== DEBUG DELETE STUDENT ===", id, roleId);
    const confirm = await Swal.fire({
      title: "Hapus akun student?",
      text: "Data yang dihapus tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await deleteStudentAccount(id, roleId);
    if (result.success) {
      await loadAllData();
      Swal.fire({ icon: "success", title: "Berhasil", text: "Akun student berhasil dihapus", timer: 2000, showConfirmButton: false });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // COUNSELOR
  const handleCounselorChange = (e) => {
    const { name, value } = e.target;
    setFormCounselor({ ...formCounselor, [name]: value });
  };

  const handleEditCounselor = (counselor) => {
  setEditingCounselor(counselor);
  setFormCounselor({
    nim: counselor.nim,
    nama: counselor.nama,
    jurusan: counselor.jurusan,
    area: counselor.area,
    fakultas: counselor.fakultas,
    periode: counselor.periode.toString()
  });
  setShowEditCounselorModal(true);
};

  const handleUpdateCounselor = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Update Data Counselor?",
      text: "Apakah Anda yakin ingin mengubah data ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Update",
      cancelButtonText: "Batal"
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    const result = await updateCounselorData(editingCounselor.id, {
      jurusan: formCounselor.jurusan,
      area: formCounselor.area,
      fakultas: formCounselor.fakultas,
      periode: parseInt(formCounselor.periode),
    });

    console.log("Update result:", result);

    if (result.success) {
      await loadAllData();
      setShowEditCounselorModal(false);
      setEditingCounselor(null);
      setFormCounselor({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
      Swal.fire("Berhasil!", "Data counselor berhasil diupdate", "success");
    } else {
      Swal.fire("Error", result.error, "error");
    }

    setLoading(false);
  };

  const handleViewCounselorDetail = (counselor) => {
    setSelectedCounselorDetail(counselor);
    setShowDetailCounselorModal(true);
  };

  const handleDeleteCounselorConfirm = async (counselor) => {
    const confirm = await Swal.fire({
      title: "Hapus Data Counselor?",
      html: `
        <p>Anda akan menghapus counselor:</p>
        <p class="mt-2"><strong>Nama:</strong> ${counselor.nama}</p>
        <p><strong>NIM:</strong> ${counselor.nim}</p>
        <p class="mt-3 text-sm text-red-600">Data yang dihapus tidak dapat dikembalikan!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626"
    });
    
    if (!confirm.isConfirmed) return;

    setLoading(true);

    const result = await deleteRoleData(counselor.nim);

    if (result.success) {
      await loadAllData();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data counselor berhasil dihapus",
        timer: 2000
      });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    
    setLoading(false);
  };

    // PARTNER
  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setFormPartner({ ...formPartner, [name]: value });
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setFormPartner({
      nim: partner.nim,
      nama: partner.nama,
      jurusan: partner.jurusan,
      area: partner.area,
      fakultas: partner.fakultas,
      periode: partner.periode.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdatePartner = async (e) => {
    e.preventDefault();

    console.log("=== DEBUG UPDATE PARTNER ===");
    console.log("editingPartner:", editingPartner);
    console.log("formPartner:", formPartner);
    
    const confirm = await Swal.fire({
      title: "Update Data Partner?",
      text: "Apakah Anda yakin ingin mengubah data ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Update",
      cancelButtonText: "Batal"
    });
    
    if (!confirm.isConfirmed) return;

    setLoading(true);

    const result = await updatePartnerData(editingPartner.id, {
      jurusan: formPartner.jurusan,
      area: formPartner.area,
      fakultas: formPartner.fakultas,
      periode: parseInt(formPartner.periode),
    });

    console.log("Update result:", result);

    if (result.success) {
      await loadAllData();
      setShowEditModal(false);
      setEditingPartner(null);
      setFormPartner({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
      Swal.fire("Berhasil!", "Data partner berhasil diupdate", "success");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    
    setLoading(false);
  };

  // BUDDY
  const handleAssignNewBuddy = (partner) => {
    setSelectedPartner(partner);
    setCurrentBuddy(null);
    setSelectedBuddyNim("");
    setBuddyModalMode('assign');
    setShowBuddyModal(true);
  };

  const handleChangeBuddy = (partner, assignedBuddy) => {
    setSelectedPartner(partner);
    setCurrentBuddy(assignedBuddy);
    setSelectedBuddyNim("");
    setBuddyModalMode('change');
    setShowBuddyModal(true);
  };

  const handleRemoveBuddy = async (partner, assignedBuddy) => {
    const confirm = await Swal.fire({
      title: "Hapus Assignment Buddy?",
      html: `
        <p>Anda akan menghapus buddy assignment:</p>
        <p class="mt-2"><strong>Partner:</strong> ${partner.nama}</p>
        <p><strong>Buddy:</strong> ${assignedBuddy.nama}</p>
        <p class="mt-3 text-sm text-red-600">Buddy ini akan di-unassign dari partner ini.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626"
    });
    
    if (!confirm.isConfirmed) return;

    setLoading(true);

    const result = await updateBuddy(assignedBuddy.nim, {
      partner_nim: null,
      partner_nama: null
    });

    if (result.success) {
      await loadAllData();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Buddy berhasil di-unassign dari partner",
        timer: 2000
      });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    
    setLoading(false);
  };

  const handleSubmitBuddyAction = async (e) => {
    e.preventDefault();
    
    if (!selectedBuddyNim) {
      Swal.fire("Error", "Pilih buddy terlebih dahulu", "error");
      return;
    }

    const selectedBuddy = dataBuddy.find(b => b.nim === selectedBuddyNim);
    console.log("Selected Buddy:", selectedBuddy, selectedPartner, currentBuddy); // Debug
    const confirm = await Swal.fire({
      title: buddyModalMode === 'assign' ? "Assign Buddy?" : "Ganti Buddy?",
      html: `
        <p><strong>Partner:</strong> ${selectedPartner.nama}</p>
        <p><strong>Buddy ${buddyModalMode === 'change' ? 'Baru' : ''}:</strong> ${selectedBuddy.nama}</p>
        ${buddyModalMode === 'change' ? `<p class="mt-2 text-sm text-orange-600">Buddy lama (${currentBuddy.nama}) akan di-unassign</p>` : ''}
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan",
      cancelButtonText: "Batal"
    });
    
    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      if (buddyModalMode === 'change' && currentBuddy) {
        console.log("Unassigning current buddy:", currentBuddy); // Debug
        await updateBuddy(currentBuddy.nim, {
          partner_nim: null,
          partner_nama: null
        });
      }

      const result = await updateBuddy(selectedBuddyNim, {
        partner_nim: selectedPartner.nim,
        partner_nama: selectedPartner.nama
      });

      if (result.success) {
        await loadAllData();
        setShowBuddyModal(false);
        setSelectedPartner(null);
        setCurrentBuddy(null);
        setSelectedBuddyNim("");
        setBuddyModalMode(null);
        
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: buddyModalMode === 'assign' ? "Buddy berhasil di-assign" : "Buddy berhasil diganti",
          timer: 2000
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Terjadi kesalahan", "error");
    }
    
    setLoading(false);
  };
  // CREATIVE TEAM
  const handleCreativeTeamChange = (e) => {
    const { name, value } = e.target;
    setFormCreativeTeam({ ...formCreativeTeam, [name]: value });
  };

  const handleAddCreativeTeam = async (e) => {
    e.preventDefault();
    if (!formCreativeTeam.nim || !formCreativeTeam.nama || !formCreativeTeam.jurusan || 
        !formCreativeTeam.area || !formCreativeTeam.fakultas || !formCreativeTeam.periode) {
      Swal.fire("Error", "Semua kolom wajib diisi", "error");
      return;
    }
    const confirm = await Swal.fire({ title: "Tambah Data Creative Team?", icon: "question", showCancelButton: true, confirmButtonText: "Ya" });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await createRoleData({
      nim: formCreativeTeam.nim,
      nama: formCreativeTeam.nama,
      jurusan: formCreativeTeam.jurusan,
      area: formCreativeTeam.area,
      fakultas: formCreativeTeam.fakultas,
      periode: parseInt(formCreativeTeam.periode),
      role: "Creative Team",
      souvenir: false
    });
    if (result.success) {
      await loadAllData();
      setFormCreativeTeam({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
      Swal.fire("Berhasil", "Data Creative Team ditambahkan", "success");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleDeleteCreativeTeam = async (nim) => {
    const confirm = await Swal.fire({ title: "Hapus Data Creative Team?", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus" });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await deleteRoleData(nim);
    if (result.success) {
      await loadAllData();
      Swal.fire("Dihapus", "Data Creative Team dihapus", "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // BUDDY
  const allRolesForBuddy = [
    ...dataInputCounselor.map((d) => ({ nim: d.nim, nama: d.nama, role: "Peer Counselor" })),
    ...dataInputPartner.map((d) => ({ nim: d.nim, nama: d.nama, role: "Peer Partner" })),
    ...dataInputCreativeTeam.map((d) => ({ nim: d.nim, nama: d.nama, role: "Creative Team" })),
  ];

  const handleBuddyChange = (e) => {
    const { name, value } = e.target;
    setFormBuddy({ ...formBuddy, [name]: value });
  };

  const handleAddBuddy = async (e) => {
    e.preventDefault();
    if (!formBuddy.nim || !formBuddy.nama || !formBuddy.jurusan || 
        !formBuddy.partnerNim || !formBuddy.roleNim) {
      showNotif("Harap isi semua kolom input buddy!", "error");
      return;
    }
    const partner = dataInputPartner.find(p => p.nim === formBuddy.partnerNim);
    const pendamping = allRolesForBuddy.find(r => r.nim === formBuddy.roleNim);
    const confirm = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah data buddy sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await createBuddy({
      nim: formBuddy.nim,
      nama: formBuddy.nama,
      jurusan: formBuddy.jurusan,
      partner_nim: formBuddy.partnerNim,
      partner_nama: partner?.nama || "-",
      pendamping_nim: formBuddy.roleNim,
      pendamping_nama: pendamping?.nama || "-",
      pendamping_role: pendamping?.role || "-"
    });
    if (result.success) {
      await loadAllData();
      setFormBuddy({ nim: "", nama: "", jurusan: "", partnerNim: "", roleNim: "", roleType: "" });
      showNotif("Data buddy berhasil ditambahkan!", "success");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleDeleteBuddy = async (nim) => {
    const confirm = await Swal.fire({
      title: "Hapus data buddy?",
      text: "Data buddy yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const result = await deleteBuddy(nim);
    if (result.success) {
      await loadAllData();
      showNotif("Data buddy berhasil dihapus!", "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // VERIFICATION COUNSELOR
  const updateVerifikasiCounselor = async (index, statusType) => {
    const confirm = await Swal.fire({
      title: "Konfirmasi Terlebih Dahulu",
      text: `Anda akan memberi status: ${statusType.toUpperCase()}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    const item = dataCounselor[index];
    let newStatus, newVerifikasi;
    if (statusType === "setuju") {
      newStatus = "Disetujui";
      newVerifikasi = true;
    } else if (statusType === "tidak") {
      newStatus = "Tidak Disetujui";
      newVerifikasi = false;
    } else {
      newStatus = "Decline";
      newVerifikasi = false;
    }
    setLoading(true);
    const result = await updateCounselorLogbook(item.id, {
      status: newStatus,
      verifikasi: newVerifikasi,
      komentar_staff: item.komentarStaff || ""
    });
    if (result.success) {
      await loadAllData();
      const notifText =
        statusType === "setuju"
          ? "Data logbook Disetujui ✅"
          : statusType === "tidak"
          ? "Data logbook Tidak Disetujui ❌"
          : "Data logbook diminta revisi (Decline) 🔁";
      showNotif(notifText, "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleKomentarCounselor = async (index, value) => {
    const item = dataCounselor[index];
    const updated = [...dataCounselor];
    updated[index].komentarStaff = value;
    setDataCounselor(updated);
    await updateCounselorLogbook(item.id, { komentar_staff: value });
  };

  const handleEditUlangCounselor = async (index) => {
    const item = dataCounselor[index];
    setLoading(true);
    const result = await updateCounselorLogbook(item.id, {
      verifikasi: false,
      status: "Menunggu",
      komentar_staff: item.komentarStaff || ""
    });
    if (result.success) {
      await loadAllData();
      showNotif("Data dikembalikan untuk diperbaiki", "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // VERIFICATION PARTNER
  const updateVerifikasiPartner = async (index, statusType) => {
    const confirm = await Swal.fire({
      title: "Konfirmasi Terlebih Dahulu",
      text: `Anda akan memberi status: ${statusType.toUpperCase()}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    const item = dataPartner[index];
    let newStatus, newVerifikasi;
    if (statusType === "setuju") {
      newStatus = "Disetujui";
      newVerifikasi = true;
    } else if (statusType === "tidak") {
      newStatus = "Tidak Disetujui";
      newVerifikasi = false;
    } else {
      newStatus = "Decline";
      newVerifikasi = false;
    }
    setLoading(true);
    const result = await updatePartnerLogbook(item.id, {
      status: newStatus,
      verifikasi: newVerifikasi,
      komentar_staff: item.komentarStaff || ""
    });
    if (result.success) {
      await loadAllData();
      const notifText =
        statusType === "setuju"
          ? "Data logbook Disetujui ✅"
          : statusType === "tidak"
          ? "Data logbook Tidak Disetujui ❌"
          : "Data logbook diminta revisi (Decline) 🔁";
      showNotif(notifText, "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleKomentarPartner = async (index, value) => {
    const item = dataPartner[index];
    const updated = [...dataPartner];
    updated[index].komentarStaff = value;
    setDataPartner(updated);
    await updatePartnerLogbook(item.id, { komentar_staff: value });
  };

  const handleEditUlangPartner = async (index) => {
    const item = dataPartner[index];
    setLoading(true);
    const result = await updatePartnerLogbook(item.id, {
      verifikasi: false,
      status: "Menunggu",
      komentar_staff: item.komentarStaff || ""
    });
    if (result.success) {
      await loadAllData();
      showNotif("Data dikembalikan untuk diperbaiki", "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // VERIFICATION CREATIVE
  const updateVerifikasiCreative = async (index, statusType) => {
    const confirm = await Swal.fire({
      title: "Konfirmasi Terlebih Dahulu",
      text: `Anda akan memberi status: ${statusType.toUpperCase()}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    const item = dataCreative[index];
    let newStatusVerifikasi, newVerifikasi;
    if (statusType === "setuju") {
      newStatusVerifikasi = "Disetujui";
      newVerifikasi = true;
    } else if (statusType === "tidak") {
      newStatusVerifikasi = "Tidak Disetujui";
      newVerifikasi = false;
    } else {
      newStatusVerifikasi = "Decline (Edit Ulang)";
      newVerifikasi = false;
    }
    setLoading(true);
    const result = await updateCreativeLogbook(item.id, {
      status_verifikasi: newStatusVerifikasi,
      verifikasi: newVerifikasi,
      komentar_staff: item.komentarStaff || ""
    });
    if (result.success) {
      await loadAllData();
      const notifText =
        statusType === "setuju"
          ? "Data logbook Disetujui ✅"
          : statusType === "tidak"
          ? "Data logbook Tidak Disetujui ❌"
          : "Data logbook diminta revisi (Decline) 🔁";
      showNotif(notifText, "info");
      window.dispatchEvent(new Event("storage"));
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const handleKomentarCreative = async (index, value) => {
    const item = dataCreative[index];
    const updated = [...dataCreative];
    updated[index].komentarStaff = value;
    setDataCreative(updated);
    await updateCreativeLogbook(item.id, { komentar_staff: value });
  };

  const handleEditUlangCreative = async (index) => {
    const item = dataCreative[index];
    setLoading(true);
    const result = await updateCreativeLogbook(item.id, {
      verifikasi: false,
      status_verifikasi: "Menunggu",
      komentar_staff: item.komentarStaff || ""
    });
    if (result.success) {
      await loadAllData();
      showNotif("Data dikembalikan untuk diperbaiki", "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // EVALUATION & QUESTIONNAIRE
  const saveEvaluasi = async () => {
    if (!inputEval.role || !inputEval.title || !inputEval.link) {
      Swal.fire({ icon: "warning", title: "Kolom Belum Lengkap", text: "Semua kolom pada form Evaluasi wajib diisi!" });
      return;
    }
    const confirm = await Swal.fire({
      title: editIndexEval !== null ? "Update Evaluasi?" : "Simpan Evaluasi?",
      text: "Pastikan data sudah benar sebelum disimpan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editIndexEval !== null ? "Ya, Update" : "Ya, Simpan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    let result;
    if (editIndexEval !== null) {
      const evalToUpdate = evalData.evaluations[editIndexEval];
      result = await updateEvaluation(evalToUpdate.id, inputEval.title, inputEval.link, inputEval.role);
    } else {
      result = await createEvaluation(inputEval.role, inputEval.title, inputEval.link);
    }
    if (result.success) {
      await loadEvaluationsAndQuestionnaires();
      setEditIndexEval(null);
      setInputEval({ title: "", link: "", role: "" });
      Swal.fire({ icon: "success", title: "Berhasil!", text: editIndexEval !== null ? "Evaluasi berhasil diupdate." : "Evaluasi berhasil disimpan." });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const deleteEvaluasi = async (index) => {
    const confirm = await Swal.fire({
      title: "Hapus Evaluasi?",
      text: "Apakah kamu yakin ingin menghapus evaluasi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const evalToDelete = evalData.evaluations[index];
    const result = await deleteEvaluation(evalToDelete.id);
    if (result.success) {
      await loadEvaluationsAndQuestionnaires();
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Evaluasi berhasil dihapus.", timer: 1500, showConfirmButton: false });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const saveKuesioner = async () => {
    if (!inputKues.role || !inputKues.title || !inputKues.link) {
      Swal.fire({ icon: "warning", title: "Kolom Belum Lengkap", text: "Semua kolom pada form Kuesioner wajib diisi!" });
      return;
    }
    const confirm = await Swal.fire({
      title: editIndexKues !== null ? "Update Kuesioner?" : "Simpan Kuesioner?",
      text: "Pastikan data sudah benar sebelum disimpan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editIndexKues !== null ? "Ya, Update" : "Ya, Simpan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    let result;
    if (editIndexKues !== null) {
      const questToUpdate = evalData.questionnaires[editIndexKues];
      result = await updateQuestionnaire(questToUpdate.id, inputKues.title, inputKues.link, inputKues.role);
    } else {
      result = await createQuestionnaire(inputKues.role, inputKues.title, inputKues.link);
    }
    if (result.success) {
      await loadEvaluationsAndQuestionnaires();
      setEditIndexKues(null);
      setInputKues({ title: "", link: "", role: "" });
      Swal.fire({ icon: "success", title: "Berhasil!", text: editIndexKues !== null ? "Kuesioner berhasil diupdate." : "Kuesioner berhasil disimpan." });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  const deleteKuesioner = async (index) => {
    const confirm = await Swal.fire({
      title: "Hapus Kuesioner?",
      text: "Apakah kamu yakin ingin menghapus kuesioner ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    const questToDelete = evalData.questionnaires[index];
    const result = await deleteQuestionnaire(questToDelete.id);
    if (result.success) {
      await loadEvaluationsAndQuestionnaires();
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Kuesioner berhasil dihapus.", timer: 1500, showConfirmButton: false });
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // SOUVENIR
  const souvenirList = [
    ...dataInputCounselor.map((d, i) => ({ ...d, role: "Peer Counselor", source: "counselor", index: i })),
    ...dataInputPartner.map((d, i) => ({ ...d, role: "Peer Partner", source: "partner", index: i })),
    ...dataInputCreativeTeam.map((d, i) => ({ ...d, role: "Creative Team", source: "creative", index: i })),
  ];

  const handleSouvenirChange = async (item, checked) => {
    setLoading(true);
    const result = await updateSouvenirStatus(item.nim, checked);
    if (result.success) {
      await loadAllData();
      showNotif(`${item.nama} (${item.role}) ${checked ? "✅ sudah mengambil souvenir" : "❌ belum mengambil souvenir"}`, "info");
    } else {
      Swal.fire("Error", result.error, "error");
    }
    setLoading(false);
  };

  // REPORT
  const columnsByRole = {
    "Peer Counselor": [
      "periode", "kampus", "nim", "nama", "jurusan", "kampusArea", "tanggalKonseling",
      "jamMulai", "jamSelesai", "durasi", "metode", "deskripsi", "kendala", "supportNeeded",
      "statusCase", "verifikasi", "komentarStaff"
    ],
    "Peer Partner": [
      "periode", "kampus", "nimBuddy", "namaBuddy", "jurusan", "partnerNama", "pendamping",
      "tanggal", "jamMulai", "jamSelesai", "durasi", "metode", "deskripsi", "kendala",
      "support", "verifikasi", "komentarStaff"
    ],
    "Creative Team": [
      "periode", "pembina", "topik", "tanggalDiskusi", "mediaDiskusi", "hasilDiskusi",
      "status", "linkIG", "verifikasi", "komentarStaff"
    ]
  };

  const headerLabels = { partnerNama: "Partner" };

  const handleTarikData = () => {
    const allData = [
      ...dataCounselor.map((d) => ({
        role: "Peer Counselor",
        periode: d.periode || "-",
        kampus: d.kampus || "-",
        nim: d.nim || "-",
        nama: d.nama || "-",
        jurusan: d.jurusan || "-",
        kampusArea: d.kampusArea || "-",
        tanggalKonseling: d.tanggalKonseling || "-",
        jamMulai: d.jamMulai || "-",
        jamSelesai: d.jamSelesai || "-",
        durasi: d.durasi || "-",
        metode: d.metode || "-",
        deskripsi: d.deskripsi || "-",
        kendala: d.kendala || "-",
        supportNeeded: d.supportNeeded || "-",
        statusCase: d.statusCase || "-",
        verifikasi: d.verifikasi ? "✅" : "❌",
        komentarStaff: d.komentarStaff || "-",
      })),
      ...dataPartner.map((d) => ({
        role: "Peer Partner",
        periode: d.periode || "-",
        kampus: d.kampus || "-",
        nimBuddy: d.nimBuddy || "-",
        namaBuddy: d.namaBuddy || "-",
        jurusan: d.jurusan || "-",
        partnerNama: d.partnerNama || "-",
        pendamping: (d.pendampingNama && d.pendampingRole ? `${d.pendampingNama} (${d.pendampingRole})` : "-"),
        tanggal: d.tanggal || d.tanggalKonseling || "-",
        jamMulai: d.jamMulai || "-",
        jamSelesai: d.jamSelesai || "-",
        durasi: d.durasi || "-",
        metode: d.metode || "-",
        deskripsi: d.deskripsi || "-",
        kendala: d.kendala || "-",
        support: d.support || d.supportNeeded || "-",
        verifikasi: d.verifikasi ? "✅" : "❌",
        komentarStaff: d.komentarStaff || "-",
      })),
      ...dataCreative.map((d) => ({
        role: "Creative Team",
        periode: d.periode || "-",
        pembina: d.pembina || "-",
        topik: d.topik || "-",
        tanggalDiskusi: d.tanggalDiskusi || "-",
        mediaDiskusi: d.mediaDiskusi || "-",
        hasilDiskusi: d.hasilDiskusi || "-",
        status: d.status || "-",
        linkIG: d.linkIG || "-",
        verifikasi: d.verifikasi ? "✅" : "❌",
        komentarStaff: d.komentarStaff || "-",
      })),
    ];

    const filtered = allData.filter((d) => {
      const matchPeriode = !selectedPeriod || d.periode === selectedPeriod;
      const matchRole = !selectedRole || d.role === selectedRole;
      return matchPeriode && matchRole;
    });

    setRiwayat(filtered);
    Swal.fire({
      icon: "success",
      title: "Data berhasil ditarik!",
      showConfirmButton: false,
      timer: 2000,
      position: "center",
    });
  };

  const handleExportSingleExcel = (item) => {
    const formattedItem = Object.entries(item).reduce((acc, [key, value]) => {
      if (key.toLowerCase().includes("durasi") && value) {
        acc[key] = `${value} menit`;
      } else if (typeof value === "boolean") {
        acc[key] = value ? "✅" : "❌";
      } else if (value === null || value === undefined || value === "") {
        acc[key] = "-";
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    const worksheet = XLSX.utils.json_to_sheet([formattedItem]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${item.nama || item.namaBuddy || item.pembina}_Data Report.xlsx`);
  };

  const handleExportExcel = () => {
    if (riwayat.length === 0) {
      Swal.fire({ icon: "warning", title: "Tidak ada data", text: "Tarik data terlebih dahulu sebelum ekspor Excel." });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(riwayat);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `Report_${selectedRole || "Semua"}_${selectedPeriod || "All"}.xlsx`);
  }
  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Notifikasi */}
      {notif.show && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
          aria-live="polite"
        >
          <div
            className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-lg transform transition-all duration-300 ${
              notif.show ? "opacity-100 scale-100" : "opacity-0 scale-90"
            } ${notif.type === "success" ? "bg-green-50" : notif.type === "error" ? "bg-red-50" : "bg-white"}`}
            style={{ minWidth: 280, maxWidth: 520 }}
          >
            <p className="text-center font-medium text-sm">
              {notif.message}
            </p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">SASC Staff</h2>
        <ul className="space-y-3 text-gray-700">
          <li
            onClick={() => setActivePage("pembina")}
            className={`cursor-pointer font-semibold ${activePage === "pembina" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Pembina
          </li>
          <li
            onClick={() => setActivePage("buddy")}
            className={`cursor-pointer font-semibold ${activePage === "buddy" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Data Buddy
          </li>
          <li
            onClick={() => setActivePage("dataloginstudent")}
            className={`cursor-pointer font-semibold ${activePage === "dataloginstudent" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Data Login Student
          </li>
          <li
            onClick={() => setActivePage("peer-counselor")}
            className={`cursor-pointer font-semibold ${activePage === "peer-counselor" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Data Counselor
          </li>
          <li
            onClick={() => setActivePage("peer-partner")}
            className={`cursor-pointer font-semibold ${activePage === "peer-partner" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Data Partner
          </li>
          <li
            onClick={() => setActivePage("creative-team")}
            className={`cursor-pointer font-semibold ${activePage === "creative-team" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Data Creative Team
          </li>
          <li
            onClick={() => setActivePage("counselor")}
            className={`cursor-pointer font-semibold ${activePage === "counselor" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Verifikasi Peer Counselor
          </li>
          <li
            onClick={() => setActivePage("partner")}
            className={`cursor-pointer font-semibold ${activePage === "partner" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Verifikasi Peer Partner
          </li>
          <li
            onClick={() => setActivePage("creative")}
            className={`cursor-pointer font-semibold ${activePage === "creative" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Verifikasi Creative Team
          </li>
          <li
            onClick={() => setActivePage("report")}
            className={`cursor-pointer font-semibold ${activePage === "report" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Tarik Data Report
          </li>
          <li
            onClick={() => setActivePage("souvenir")}
            className={`cursor-pointer font-semibold ${activePage === "souvenir" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Checklist Pengambilan Souvenir
          </li>
          <li
            onClick={() => setActivePage("evaluasi-kuesioner")}
            className={`cursor-pointer font-semibold ${activePage === "evaluasi-kuesioner" ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            Input Evaluasi dan Kuesioner
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-10">

        <div className="flex justify-end items-center mb-8 space-x-6">
          <div className="flex items-center space-x-4">
            <User className="text-gray-700" />
            <div>
              <p className="font-semibold text-gray-800">Staff SASC</p>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>

            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-900 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* PAGE: INPUT PEMBINA */}
        {activePage === "pembina" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Input Pembina</h1>

            <form onSubmit={handleAddPembina} className="bg-white p-6 rounded-2xl shadow mb-8">
              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-semibold">Nama Pembina</label>
                  <input
                    type="text"
                    value={formPembina.nama}
                    onChange={(e) => setFormPembina({ ...formPembina, nama: e.target.value })}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Masukkan nama"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Binusian ID</label>
                  <input
                    type="text"
                    value={formPembina.binusianId}
                    onChange={(e) => setFormPembina({ ...formPembina, binusianId: e.target.value })}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Masukkan Binusian ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Area Kampus</label>
                  <select
                    name="area"
                    value={formPembina.area}
                    onChange={(e) => setFormPembina({ ...formPembina, area: e.target.value })}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">-- Pilih Area Kampus --</option>
                    <option value="Kemanggisan">Kemanggisan</option>
                    <option value="Alam Sutera">Alam Sutera</option>
                    <option value="Bekasi">Bekasi</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Malang">Malang</option>
                    <option value="Semarang">Semarang</option>
                    <option value="Medan">Medan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold">PIC</label>
                  <input
                    type="text"
                    value={formPembina.pic}
                    onChange={(e) => setFormPembina({ ...formPembina, pic: e.target.value })}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Masukkan PIC"
                  />
                </div>

              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Tambah Pembina
                </button>
              </div>
            </form>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Daftar Pembina</h2>
              
              {/* Fitur pencarian */}
              <input
                type="text"
                value={searchPembina}
                onChange={(e) => setSearchPembina(e.target.value)}
                placeholder="Cari nama pembina..."
                className="border rounded-lg p-2 w-64 mb-4"
              />

              {pembinaList.length === 0 ? (
                <p className="text-gray-500">Belum ada pembina yang ditambahkan.</p>
              ) : (

                <div className="max-h-96 overflow-y-auto rounded-lg border">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-200 sticky top-0">
                      <tr className="border-b">
                        <th className="p-2">Binusian ID</th>
                        <th className="p-2">Nama</th>
                        <th className="p-2">Area Kampus</th>
                        <th className="p-2">PIC</th>
                        <th className="p-2">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pembinaList
                        .filter((p) =>
                          searchPembina === "" ||
                          p.nama?.toLowerCase().includes(searchPembina.toLowerCase())
                        )
                        .map((p, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{p.binusianId}</td>
                            <td className="p-2">{p.nama}</td>
                            <td className="p-2">{p.area}</td>
                            <td className="p-2">{p.pic}</td>
                            <td className="p-2">
                              <button
                                onClick={() => handleDeletePembina(p.binusianId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* PAGE: INPUT DATA BUDDY */}
        {activePage === "buddy" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Input Data Buddy</h1>
            
            <form onSubmit={handleAddBuddy} className="bg-white p-6 rounded-2xl shadow mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIM</label>
                  <input 
                    type="text" 
                    name="nim" 
                    value={formBuddy.nim} 
                    onChange={handleBuddyChange} 
                    className="border rounded-lg p-2 w-full" 
                    placeholder="Masukkan NIM" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
                  <input 
                    type="text" 
                    name="nama" 
                    value={formBuddy.nama} 
                    onChange={handleBuddyChange} 
                    className="border rounded-lg p-2 w-full" 
                    placeholder="Masukkan Nama" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jurusan</label>
                  <input 
                    type="text" 
                    name="jurusan" 
                    value={formBuddy.jurusan} 
                    onChange={handleBuddyChange} 
                    className="border rounded-lg p-2 w-full" 
                    placeholder="Masukkan Jurusan" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Pilih Partner
                  </label>
                  <select
                    name="partnerNim"
                    value={formBuddy.partnerNim}
                    onChange={handleBuddyChange}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">-- Pilih Partner (Opsional) --</option>
                    {/* Filter: Partner yang belum di-assign ke buddy lain */}
                    {dataInputPartner
                      .filter(partner => {
                        // Cari apakah partner ini sudah di-assign ke buddy lain
                        const isAssigned = dataBuddy.some(
                          buddy => buddy.partnerNim === partner.nim
                        );
                        return !isAssigned; // Hanya tampilkan yang belum di-assign
                      })
                      .map((p, i) => (
                        <option key={i} value={p.nim}>
                          {p.nama} ({p.nim}) - {p.area}
                        </option>
                      ))
                    }
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {dataInputPartner.filter(p => !dataBuddy.some(b => b.partnerNim === p.nim)).length === 0 
                      ? "⚠️ Semua partner sudah di-assign" 
                      : `${dataInputPartner.filter(p => !dataBuddy.some(b => b.partnerNim === p.nim)).length} partner tersedia`
                    }
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Pilih Pendamping (Counselor Only)
                  </label>
                  <select
                    value={formBuddy.roleNim}
                    onChange={(e) => {
                      const selected = allRolesForBuddy.find(
                        (r) => r.nim === e.target.value
                      );

                      setFormBuddy({
                        ...formBuddy,
                        roleNim: e.target.value,
                        roleType: selected?.role || ""
                      });
                    }}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">-- Pilih Counselor --</option>
                    {/* Filter: Hanya Counselor yang belum di-assign */}
                    {allRolesForBuddy
                      .filter(role => {
                        // RULE 2: Counselor yang belum di-assign ke buddy lain
                        const isAssigned = dataBuddy.some(
                          buddy => buddy.pendampingNim === role.nim
                        );
                        return !isAssigned;
                      })
                      .map((r, i) => (
                        <option key={i} value={r.nim}>
                          {r.nama} ({r.nim}) - {r.area}
                        </option>
                      ))
                    }
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {allRolesForBuddy.filter(r => !dataBuddy.some(b => b.pendampingNim === r.nim)
                    ).length === 0 
                      ? "⚠️ Semua counselor sudah di-assign" 
                      : `${allRolesForBuddy.filter(r =>!dataBuddy.some(b => b.pendampingNim === r.nim)
                        ).length} counselor tersedia`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  type="submit" 
                  className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Tambah Buddy
                </button>
              </div>
            </form>

            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Daftar Buddy</h2>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold">{dataBuddy.length}</span> Buddy
                </div>
              </div>
              
              {/* Fitur pencarian */}
              <div className="mb-4 flex gap-3">
                <input
                  type="text"
                  value={searchBuddy}
                  onChange={(e) => setSearchBuddy(e.target.value)}
                  placeholder="Cari nama atau NIM buddy..."
                  className="border rounded-lg p-2 flex-1"
                />
                <select
                  className="border p-2 rounded-lg"
                  onChange={(e) => {
                    const filter = e.target.value;
                    if (filter === "all") setSearchBuddy("");
                    // Bisa tambahkan filter lain jika perlu
                  }}
                >
                  <option value="all">Semua Status</option>
                  <option value="with-partner">Dengan Partner</option>
                  <option value="no-partner">Tanpa Partner</option>
                </select>
              </div>
              
              {dataBuddy.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-2">Belum ada data buddy</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto rounded-lg border">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-200 sticky top-0">
                      <tr className="border-b">
                        <th className="py-2 px-3 text-center">NIM</th>
                        <th className="py-2 px-3 text-center">Nama Buddy</th>
                        <th className="py-2 px-3 text-center">Jurusan</th>
                        <th className="py-2 px-3 text-center">Partner Assigned</th>
                        <th className="py-2 px-3 text-center">Pendamping (Counselor)</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataBuddy
                        .filter((b) =>
                          searchBuddy === "" ||
                          b.nama?.toLowerCase().includes(searchBuddy.toLowerCase()) ||
                          b.nim?.toLowerCase().includes(searchBuddy.toLowerCase())
                        )
                        .map((b, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-3 text-center font-medium">{b.nim}</td>
                            <td className="py-2 px-3 text-center">{b.nama}</td>
                            <td className="py-2 px-3 text-center">{b.jurusan}</td>
                            <td className="py-2 px-3 text-center">
                              {b.partnerNama ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ {b.partnerNama}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Belum Ada
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {b.pendampingNama ? (
                                <div className="flex flex-col items-center">
                                  <span className="font-medium">{b.pendampingNama}</span>
                                  <span className="text-xs text-gray-500">({b.pendampingRole})</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => handleDeleteBuddy(b.nim)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* PAGE: INPUT DATA LOGIN STUDENT */}
        {activePage === "dataloginstudent" && (
          <>
            <h1 className="text-2xl font-bold mb-6">
              Input Data Login Student
            </h1>

            <form
              onSubmit={handleAddStudentAccount}
              className="bg-white p-6 rounded-2xl shadow mb-8"
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Username"
                  value={formStudentLogin.username}
                  onChange={(e) =>
                    setFormStudentLogin({
                      ...formStudentLogin,
                      username: e.target.value
                    })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  placeholder="Password"
                  value={formStudentLogin.password}
                  onChange={(e) =>
                    setFormStudentLogin({
                      ...formStudentLogin,
                      password: e.target.value
                    })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  placeholder="NIM"
                  value={formStudentLogin.nim}
                  onChange={(e) =>
                    setFormStudentLogin({
                      ...formStudentLogin,
                      nim: e.target.value
                    })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  placeholder="Nama Student"
                  value={formStudentLogin.nama}
                  onChange={(e) =>
                    setFormStudentLogin({
                      ...formStudentLogin,
                      nama: e.target.value
                    })
                  }
                  className="border p-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button className="bg-blue-500 text-white px-5 py-2 rounded-lg">
                  Simpan Akun
                </button>
              </div>
            </form>

            {/* TABEL AKUN */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold mb-4">
                Daftar Akun Student
              </h2>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama student"
                  value={searchNamaStudent}
                  onChange={(e) => setSearchNamaStudent(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-200 sticky top-0">
                  <tr className="border-b">
                    <th className="py-2 px-3 text-center">Username</th>
                    <th className="py-2 px-3 text-center">Password</th>
                    <th className="py-2 px-3 text-center">NIM</th>
                    <th className="py-2 px-3 text-center">Nama</th>
                    <th className="py-2 px-3 text-center"> Role </th>
                    <th className="py-2 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAccounts
                    .filter((s) =>
                      searchNamaStudent === "" ||
                      s.nama?.toLowerCase().includes(searchNamaStudent.toLowerCase())
                    )
                    .map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 px-3 text-center">{s.username}</td>
                      <td className="py-2 px-3 text-center">{s.password}</td>
                      <td className="py-2 px-3 text-center">{s.nim}</td>
                      <td className="py-2 px-3 text-center">{s.nama}</td>
                      <td className="py-2 px-3 text-center">{s.roleData?.role || "Belum ada role"}</td>
                      <td className="p-2 px-3 text-center">
                        <button
                          onClick={() => {
                            console.log("Deleting student with user_id:", s, s.roleData?.user_id, "and id:", s.roleData?.id);
                            handleDeleteStudent(s.id, s.roleData?.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

       {activePage === "peer-counselor" && (
  <>
    <h1 className="text-2xl font-bold mb-6">Kelola Peer Counselor</h1>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Info:</strong> Data Peer Counselor dibuat oleh mahasiswa saat login dan memilih role. 
            Di sini Anda dapat <strong>edit data</strong> dan <strong>melihat informasi</strong> setiap Counselor.
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Daftar Peer Counselor</h2>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{dataInputCounselor.length}</span> Counselor
        </div>
      </div>
      
      <div className="mb-4 flex gap-3">
        <input
          value={searchCounselor}
          onChange={(e) => setSearchCounselor(e.target.value)}
          placeholder="Cari nama atau NIM..."
          className="border p-2 rounded-lg flex-1"
        />
        <select
          className="border p-2 rounded-lg"
          onChange={(e) => setFilterCounselorArea(e.target.value)}
          value={filterCounselorArea}
        >
          <option value="">Semua Area</option>
          <option value="Kemanggisan">Kemanggisan</option>
          <option value="Alam Sutera">Alam Sutera</option>
          <option value="Bekasi">Bekasi</option>
          <option value="Bandung">Bandung</option>
          <option value="Malang">Malang</option>
          <option value="Semarang">Semarang</option>
          <option value="Medan">Medan</option>
        </select>
        <select
          className="border p-2 rounded-lg"
          onChange={(e) => setFilterCounselorPeriode(e.target.value)}
          value={filterCounselorPeriode}
        >
          <option value="">Semua Periode</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {dataInputCounselor.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-2">Belum ada Peer Counselor yang terdaftar</p>
          <p className="text-sm mt-1">Counselor akan muncul setelah mahasiswa memilih role</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-200 sticky top-0">
              <tr className="border-b">
                <th className="py-3 px-4 text-center">NIM</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Jurusan</th>
                <th className="py-3 px-4 text-center">Area Kampus</th>
                <th className="py-3 px-4 text-center">Fakultas</th>
                <th className="py-3 px-4 text-center">Periode</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataInputCounselor
                .filter((c) => {
                  const matchSearch = 
                    (c.nama || "").toLowerCase().includes(searchCounselor.toLowerCase()) ||
                    (c.nim || "").toLowerCase().includes(searchCounselor.toLowerCase());
                  const matchArea = !filterCounselorArea || c.area === filterCounselorArea;
                  const matchPeriode = !filterCounselorPeriode || c.periode?.toString() === filterCounselorPeriode;
                  return matchSearch && matchArea && matchPeriode;
                })
                .map((counselor, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-center font-medium">{counselor.nim}</td>
                    <td className="py-3 px-4 text-center">{counselor.nama}</td>
                    <td className="py-3 px-4 text-center">{counselor.jurusan}</td>
                    <td className="py-3 px-4 text-center">{counselor.area}</td>
                    <td className="py-3 px-4 text-center text-xs">{counselor.fakultas}</td>
                    <td className="py-3 px-4 text-center">{counselor.periode}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Aktif
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditCounselor(counselor)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          title="Edit data counselor"
                        >
                          Edit Data
                        </button>
                        <button
                          onClick={() => handleViewCounselorDetail(counselor)}
                          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                          title="Lihat detail"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {showEditCounselorModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Edit Data Counselor</h2>
            <p className="text-sm text-gray-600 mt-1">NIM: {editingCounselor?.nim}</p>
          </div>
          
          <form onSubmit={handleUpdateCounselor} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nama</label>
                <input
                  name="nama"
                  value={formCounselor.nama}
                  onChange={handleCounselorChange}
                  className="border p-2 rounded-lg w-full"
                  placeholder="Nama Counselor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Jurusan</label>
                <input
                  name="jurusan"
                  value={formCounselor.jurusan}
                  onChange={handleCounselorChange}
                  className="border p-2 rounded-lg w-full"
                  placeholder="Jurusan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Area Kampus</label>
                <select
                  name="area"
                  value={formCounselor.area}
                  onChange={handleCounselorChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="">-- Pilih Area --</option>
                  <option value="Kemanggisan">Kemanggisan</option>
                  <option value="Alam Sutera">Alam Sutera</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Malang">Malang</option>
                  <option value="Semarang">Semarang</option>
                  <option value="Medan">Medan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Fakultas</label>
                <select
                  name="fakultas"
                  value={formCounselor.fakultas}
                  onChange={handleCounselorChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="">-- Pilih Fakultas --</option>
                  <option value="School of Computer Science">School of Computer Science</option>
                  <option value="School of Information System">School of Information System</option>
                  <option value="Faculty of Humanities">Faculty of Humanities</option>
                  <option value="School of Design">School of Design</option>
                  <option value="Business School">Business School</option>
                  <option value="Faculty Engineering">Faculty Engineering</option>
                  <option value="Faculty of Economics & Communication">Faculty of Economics & Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Periode</label>
                <input
                  type="number"
                  name="periode"
                  value={formCounselor.periode}
                  onChange={handleCounselorChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="2025"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditCounselorModal(false);
                  setEditingCounselor(null);
                  setFormCounselor({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Update Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {showDetailCounselorModal && selectedCounselorDetail && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Detail Counselor</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">NIM</p>
                <p className="font-semibold">{selectedCounselorDetail.nim}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-semibold">{selectedCounselorDetail.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jurusan</p>
                <p className="font-semibold">{selectedCounselorDetail.jurusan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area Kampus</p>
                <p className="font-semibold">{selectedCounselorDetail.area}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fakultas</p>
                <p className="font-semibold">{selectedCounselorDetail.fakultas}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Periode</p>
                <p className="font-semibold">{selectedCounselorDetail.periode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status Souvenir</p>
                <p className="font-semibold">
                  {selectedCounselorDetail.souvenir ? (
                    <span className="text-green-600">✓ Sudah Diambil</span>
                  ) : (
                    <span className="text-yellow-600">Belum Diambil</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold">{selectedCounselorDetail.role}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailCounselorModal(false);
                  setSelectedCounselorDetail(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowDetailCounselorModal(false);
                  handleEditCounselor(selectedCounselorDetail);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Data
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
)}

{activePage === "peer-partner" && (
  <>
    <h1 className="text-2xl font-bold mb-6">Kelola Peer Partner</h1>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Info:</strong> Data Partner dibuat saat mahasiswa memilih role. 
            Buddy di-assign lewat menu <strong>"Input Data Buddy"</strong>. 
            Di sini Anda bisa <strong>edit data Partner</strong> dan <strong>kelola assignment buddy-nya</strong>.
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Daftar Peer Partner</h2>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{dataInputPartner.length}</span> Partner
        </div>
      </div>
      
      <div className="mb-4 flex gap-3">
        <input
          value={searchPartner}
          onChange={(e) => setSearchPartner(e.target.value)}
          placeholder="Cari nama atau NIM..."
          className="border p-2 rounded-lg flex-1"
        />
        <select
          className="border p-2 rounded-lg"
          onChange={(e) => {
            const filter = e.target.value;
            if (filter === "all") setSearchPartner("");
            else if (filter === "with-buddy") {
            } else if (filter === "no-buddy") {
            }
          }}
        >
          <option value="all">Semua Status</option>
          <option value="with-buddy">Dengan Buddy</option>
          <option value="no-buddy">Tanpa Buddy</option>
        </select>
      </div>

      {dataInputPartner.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-2">Belum ada Peer Partner yang terdaftar</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-200 sticky top-0">
              <tr className="border-b">
                <th className="py-3 px-4 text-center">NIM</th>
                <th className="py-3 px-4 text-center">Nama Partner</th>
                <th className="py-3 px-4 text-center">Jurusan</th>
                <th className="py-3 px-4 text-center">Area</th>
                <th className="py-3 px-4 text-center">Periode</th>
                <th className="py-3 px-4 text-center">Buddy Assigned</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataInputPartner
                .filter((p) =>
                  (p.nama || "").toLowerCase().includes(searchPartner.toLowerCase()) ||
                  (p.nim || "").toLowerCase().includes(searchPartner.toLowerCase())
                )
                .map((partner, i) => {
                  console.log("Mencari buddy untuk partner:", dataBuddy, partner.nim);
                  const assignedBuddy = dataBuddy.find(b => b.partnerNim === partner.nim);
                  
                  return (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-center font-medium">{partner.nim}</td>
                      <td className="py-3 px-4 text-center">{partner.nama}</td>
                      <td className="py-3 px-4 text-center">{partner.jurusan}</td>
                      <td className="py-3 px-4 text-center">{partner.area}</td>
                      <td className="py-3 px-4 text-center">{partner.periode}</td>
                      <td className="py-3 px-4 text-center">
                        {assignedBuddy ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ {assignedBuddy.nama}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({assignedBuddy.nim})
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Belum Ada Buddy
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditPartner(partner)}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            title="Edit data partner"
                          >
                            Edit Data
                          </button>
                          
                          {assignedBuddy ? (
                            <>
                              <button
                                onClick={() => handleChangeBuddy(partner, assignedBuddy)}
                                className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                                title="Ganti buddy"
                              >
                                Ganti Buddy
                              </button>
                              <button
                                onClick={() => handleRemoveBuddy(partner, assignedBuddy)}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                                title="Hapus buddy"
                              >
                                Hapus Buddy
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleAssignNewBuddy(partner)}
                              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                              title="Assign buddy baru"
                            >
                              Assign Buddy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {showEditModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Edit Data Partner</h2>
            <p className="text-sm text-gray-600 mt-1">NIM: {editingPartner?.nim}</p>
          </div>
          
          <form onSubmit={handleUpdatePartner} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nama</label>
                <input
                  name="nama"
                  value={formPartner.nama}
                  onChange={handlePartnerChange}
                  className="border p-2 rounded-lg w-full"
                  placeholder="Nama Partner"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Jurusan</label>
                <input
                  name="jurusan"
                  value={formPartner.jurusan}
                  onChange={handlePartnerChange}
                  className="border p-2 rounded-lg w-full"
                  placeholder="Jurusan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Area Kampus</label>
                <select
                  name="area"
                  value={formPartner.area}
                  onChange={handlePartnerChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="">-- Pilih Area --</option>
                  <option value="Kemanggisan">Kemanggisan</option>
                  <option value="Alam Sutera">Alam Sutera</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Malang">Malang</option>
                  <option value="Semarang">Semarang</option>
                  <option value="Medan">Medan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Fakultas</label>
                <select
                  name="fakultas"
                  value={formPartner.fakultas}
                  onChange={handlePartnerChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="">-- Pilih Fakultas --</option>
                  <option value="School of Computer Science">School of Computer Science</option>
                  <option value="School of Information System">School of Information System</option>
                  <option value="Faculty of Humanities">Faculty of Humanities</option>
                  <option value="School of Design">School of Design</option>
                  <option value="Business School">Business School</option>
                  <option value="Faculty Engineering">Faculty Engineering</option>
                  <option value="Faculty of Economics & Communication">Faculty of Economics & Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Periode</label>
                <input
                  type="number"
                  name="periode"
                  value={formPartner.periode}
                  onChange={handlePartnerChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="2025"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPartner(null);
                  setFormPartner({ nim: "", nama: "", jurusan: "", area: "", fakultas: "", periode: "" });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Update Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {showBuddyModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
                {buddyModalMode === 'assign' ? 'Assign Buddy Baru' : 
                  buddyModalMode === 'change' ? 'Ganti Buddy' : 'Kelola Buddy'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Partner: <span className="font-semibold">{selectedPartner?.nama}</span> ({selectedPartner?.nim})
                    </p>
                    {currentBuddy && buddyModalMode === 'change' && (
                      <p className="text-sm text-orange-600 mt-1">
                        Buddy saat ini: <span className="font-semibold">{currentBuddy.nama}</span> ({currentBuddy.nim})
                      </p>
                    )}
                  </div>
                  
                  <form onSubmit={handleSubmitBuddyAction} className="p-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        {buddyModalMode === 'change' ? 'Pilih Buddy Baru' : 'Pilih Buddy'} 
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedBuddyNim}
                        onChange={(e) => setSelectedBuddyNim(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                        required
                      >
                        <option value="">-- Pilih Buddy --</option>
                        {dataBuddy
                          .filter(b => !b.partnerNim || b.partnerNim === selectedPartner?.nim)
                          .map((buddy, i) => (
                            <option key={i} value={buddy.nim}>
                              {buddy.nama} ({buddy.nim}) - {buddy.jurusan}
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Hanya buddy yang belum di-assign yang ditampilkan
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBuddyModal(false);
                          setSelectedPartner(null);
                          setCurrentBuddy(null);
                          setSelectedBuddyNim("");
                          setBuddyModalMode(null);
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                      >
                        {loading ? "Menyimpan..." : 
                        buddyModalMode === 'assign' ? 'Assign Buddy' : 'Ganti Buddy'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {activePage === "creative-team" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Daftar Data Creative Team</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Info:</strong> Data Creative Team dibuat saat mahasiswa memilih role. 
                      Di sini Anda bisa <strong>Lihat data Creative Team</strong> dan <strong>kelola atau hapus data Creative Team</strong>.
                    </p>
                  </div>
                </div>
              </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <input
                value={searchCreativeTeam}
                onChange={(e) => setSearchCreativeTeam(e.target.value)}
                placeholder="Cari nama creative team..."
                className="border p-2 rounded-lg mb-4"
              />

              <div className="max-h-56 overflow-y-auto rounded-lg border">
                <table className="min-w-full text-left text-sm">
                   <thead className="bg-gray-200 sticky top-0">
                    <tr className="border-b">
                      <th className="py-2 px-3 text-center">NIM</th>
                      <th className="py-2 px-3 text-center">Nama</th>
                      <th className="py-2 px-3 text-center">Jurusan</th>
                      <th className="py-2 px-3 text-center">Area Kampus</th>
                      <th className="py-2 px-3 text-center">Fakultas</th>
                      <th className="py-2 px-3 text-center">Periode</th>
                      <th className="py-2 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataInputCreativeTeam
                      .filter((ct) =>
                        (ct.nama || "").toLowerCase().includes(searchCreativeTeam.toLowerCase())
                      )
                      .map((ct, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 text-center">{ct.nim}</td>
                          <td className="py-2 px-3 text-center">{ct.nama}</td>
                          <td className="py-2 px-3 text-center">{ct.jurusan}</td>
                          <td className="py-2 px-3 text-center">{ct.area}</td>
                          <td className="py-2 px-3 text-center">{ct.fakultas}</td>
                          <td className="py-2 px-3 text-center">{ct.periode}</td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleDeleteCreativeTeam(ct.nim)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* PAGE: VERIFIKASI PEER COUNSELOR */}
        {activePage === "counselor" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Verifikasi Peer Counselor</h1>
            <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Cari berdasarkan periode (contoh: 2023, 2024, atau 2025...)"
                  className="border rounded-lg p-2 w-full md:w-1/3"
                  value={searchPeriode}
                  onChange={(e) => setSearchPeriode(e.target.value)}
                />
              </div>
              {dataCounselor.length === 0 ? (
                <p className="text-gray-500">Belum ada data peer counselor.</p>
              ) : (
                <div className="max-h-[750px] overflow-y-auto rounded-lg border">
                <table className="min-w-full text-sm text-left border-collapse table-fixed w-full">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="py-2 px-3 text-center">Periode</th>
                      <th className="py-2 px-3 text-center">Kampus</th>
                      <th className="py-2 px-3 text-center">NIM</th>
                      <th className="py-2 px-3 text-center">Nama</th>
                      <th className="py-2 px-3 text-center">Jurusan</th>
                      <th className="py-2 px-3 text-center">Area Kampus Mahasiswa</th>
                      <th className="py-2 px-3 text-center">Tanggal Konseling</th>
                      <th className="py-2 px-3 text-center">Jam Mulai</th>
                      <th className="py-2 px-3 text-center">Jam Selesai</th>
                      <th className="py-2 px-3 text-center">Durasi</th>
                      <th className="py-2 px-3 text-center">Metode</th>
                      <th className="py-2 px-3 text-center">Deskripsi Kegiatan</th>
                      <th className="py-2 px-3 text-center">Kendala Konseling</th>
                      <th className="py-2 px-3 text-center">Support Needed</th>
                      <th className="py-2 px-3 text-center">Status Case</th>
                      <th className="py-2 px-3 text-center">Verifikasi</th>
                      <th className="py-2 px-3 text-center">Komentar Staff</th>
                      <th className="py-2 px-3 text-center">Status Proses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCounselor
                      .map((item, originalIndex) => ({ ...item, originalIndex }))
                      .filter((item) =>
                        item.periode?.toLowerCase().includes(searchPeriode.toLowerCase())
                      )
                      .map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-center">{item.periode || "-"}</td>
                        <td className="py-2 px-3 text-center">{item.kampus || "-"}</td>
                        <td className="py-2 px-3 text-center">{item.nim}</td>
                        <td className="py-2 px-3 text-center">{item.nama}</td>
                        <td className="py-2 px-3 text-center">{item.jurusan}</td>
                        <td className="py-2 px-3 text-center">{item.kampusArea}</td>
                        <td className="py-2 px-3 text-center">{item.tanggalKonseling}</td>
                        <td className="py-2 px-3 text-center">{item.jamMulai}</td>
                        <td className="py-2 px-3 text-center">{item.jamSelesai}</td>
                        <td className="py-2 px-3 text-center">{item.durasi} menit</td>
                        <td className="py-2 px-3 text-center capitalize">{item.metode}</td>
                        <td className="py-2 px-3 text-center">{item.deskripsi}</td>
                        <td className="py-2 px-3 text-center">{item.kendala}</td>
                        <td className="py-2 px-3 text-center">{item.supportNeeded}</td>
                        <td className="py-2 px-3 text-center">{item.statusCase}</td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => updateVerifikasiCounselor(item.originalIndex, "setuju")}
                              className="text-green-600 text-xl transition-transform transform hover:scale-125 hover:rotate-12 cursor-pointer"
                              title="Setujui"
                            >
                              ✔️
                            </button>
                            <button
                              onClick={() => updateVerifikasiCounselor(item.originalIndex, "tidak")}
                              className="text-red-600 text-xl transition-transform transform hover:scale-125 hover:-rotate-12 cursor-pointer"
                              title="Tidak Disetujui"
                            >
                              ❌
                            </button>
                            <button
                              onClick={() => updateVerifikasiCounselor(item.originalIndex, "decline")}
                              className="text-orange-500 text-xl transition-transform transform hover:scale-125 hover:rotate-12 cursor-pointer"
                              title="Decline (Edit Ulang)"
                            >
                              🔁
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {item.status === "Decline (Edit Ulang)" ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={item.komentarStaff || ""}
                                onChange={(e) => handleKomentarCounselor(item.originalIndex, e.target.value)}
                                className="border rounded-lg p-2 w-full"
                                placeholder="Komentar revisi..."
                              />
                              <button
                                onClick={() => handleEditUlangCounselor(item.originalIndex)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-sm"
                              >
                                Kirim Ulang
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={item.komentarStaff || ""}
                              onChange={(e) => handleKomentarCounselor(item.originalIndex, e.target.value)}
                              className="border rounded-lg p-2 w-full"
                              placeholder="Tulis komentar..."
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {item.status === "Disetujui" && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Disetujui
                            </span>
                          )}
                          {item.status === "Tidak Disetujui" && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Tidak Disetujui
                            </span>
                          )}
                          {item.status === "Decline" && (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Revisi
                            </span>
                          )}
                          {(item.status === undefined || item.status === "Menunggu") && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Menunggu
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </>
        )}

        {/* PAGE: VERIFIKASI PEER PARTNER */}
        {activePage === "partner" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Verifikasi Peer Partner</h1>
            <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Cari berdasarkan periode (contoh: 2023, 2024, atau 2025...)"
                  className="border rounded-lg p-2 w-full md:w-1/3"
                  value={searchPeriode}
                  onChange={(e) => setSearchPeriode(e.target.value)}
                />
              </div>
              {dataPartner.length === 0 ? (
                <p className="text-gray-500">Belum ada data peer partner.</p>
              ) : (
                <div className="max-h-[750px] overflow-y-auto rounded-lg border">
                <table className="min-w-full text-sm text-left border-collapse table-fixed w-full">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="py-2 px-3 text-center">Periode</th>
                      <th className="py-2 px-3 text-center">Kampus</th>
                      <th className="py-2 px-3 text-center">Nama</th>
                      <th className="py-2 px-3 text-center">Partner dan Pendamping</th>
                      <th className="py-2 px-3 text-center">Tanggal Konseling</th>
                      <th className="py-2 px-3 text-center">Jam Mulai</th>
                      <th className="py-2 px-3 text-center">Jam Selesai</th>
                      <th className="py-2 px-3 text-center">Durasi</th>
                      <th className="py-2 px-3 text-center">Metode</th>
                      <th className="py-2 px-3 text-center">Deskripsi Kegiatan</th>
                      <th className="py-2 px-3 text-center">Kendala Konseling</th>
                      <th className="py-2 px-3 text-center">Support Needed</th>
                      <th className="py-2 px-3 text-center">Verifikasi</th>
                      <th className="py-2 px-3 text-center">Komentar Staff</th>
                      <th className="py-2 px-3 text-center">Status Proses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPartner
                      .map((item, originalIndex) => ({ ...item, originalIndex }))
                      .filter((item) =>
                        item.periode?.toLowerCase().includes(searchPeriode.toLowerCase())
                      )
                      .map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-center">{item.periode || "-"}</td>
                        <td className="py-2 px-3 text-center">{item.kampus || "-"}</td>
                        <td className="py-2 px-3 text-center">{item.nama || item.namaBuddy}</td>
                        <td className="py-2 px-3 text-center">
                          {item.partnerNama} - {item.pendampingNama} ({item.pendampingRole})
                        </td>
                        <td className="py-2 px-3 text-center">
                          {item.tanggalKonseling || item.tanggal}
                        </td>
                        <td className="py-2 px-3 text-center">{item.jamMulai}</td>
                        <td className="py-2 px-3 text-center">{item.jamSelesai}</td>
                        <td className="py-2 px-3 text-center">{item.durasi} menit</td>
                        <td className="py-2 px-3 text-center capitalize">{item.metode}</td>
                        <td className="py-2 px-3 text-center">{item.deskripsi}</td>
                        <td className="py-2 px-3 text-center">{item.kendala}</td>
                        <td className="py-2 px-3 text-center">
                          {item.supportNeeded || item.support}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => updateVerifikasiPartner(item.originalIndex, "setuju")}
                              className="text-green-600 text-xl transition-transform transform hover:scale-125 hover:rotate-12 cursor-pointer"
                            >
                              ✔️
                            </button>
                            <button
                              onClick={() => updateVerifikasiPartner(item.originalIndex, "tidak")}
                              className="text-red-600 text-xl transition-transform transform hover:scale-125 hover:-rotate-12 cursor-pointer"
                            >
                              ❌
                            </button>
                            <button
                              onClick={() => updateVerifikasiPartner(item.originalIndex, "decline")}
                              className="text-yellow-500 text-xl transition-transform transform hover:scale-125 cursor-pointer"
                              title="Minta revisi (Decline)"
                            >
                              🔁
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {item.status === "Decline (Edit Ulang)" ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={item.komentarStaff || ""}
                                onChange={(e) => handleKomentarPartner(item.originalIndex, e.target.value)}
                                className="border rounded-lg p-2 w-full"
                                placeholder="Komentar revisi..."
                              />
                              <button
                                onClick={() => handleEditUlangPartner(item.originalIndex)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-sm"
                              >
                                Kirim Ulang
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={item.komentarStaff || ""}
                              onChange={(e) => handleKomentarPartner(item.originalIndex, e.target.value)}
                              className="border rounded-lg p-2 w-full"
                              placeholder="Tulis komentar..."
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {item.status === "Disetujui" && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Disetujui
                            </span>
                          )}
                          {item.status === "Tidak Disetujui" && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Tidak Disetujui
                            </span>
                          )}
                          {item.status === "Decline" && (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Revisi
                            </span>
                          )}
                          {(item.status === undefined || item.status === "Menunggu") && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Menunggu
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </>
        )}

        {/* PAGE: VERIFIKASI CREATIVE TEAM */}
        {activePage === "creative" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Verifikasi Creative team</h1>
            <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Cari berdasarkan periode (contoh: 2023, 2024, atau 2025...)"
                  className="border rounded-lg p-2 w-full md:w-1/3"
                  value={searchPeriode}
                  onChange={(e) => setSearchPeriode(e.target.value)}
                />
              </div>
              {dataCreative.length === 0 ? (
                <p className="text-gray-500">Belum ada data Creative Team.</p>
              ) : (
                <div className="max-h-[750px] overflow-y-auto rounded-lg border">
                <table className="min-w-full text-sm text-left border-collapse table-fixed w-full">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="py-2 px-3 text-center">Periode</th>
                      <th className="py-2 px-3 text-center">Pembina</th>
                      <th className="py-2 px-3 text-center">Topik</th>
                      <th className="py-2 px-3 text-center">Tanggal Diskusi</th>
                      <th className="py-2 px-3 text-center">Media Diskusi</th>
                      <th className="py-2 px-3 text-center">Hasil Diskusi</th>
                      <th className="py-2 px-3 text-center">Status Proses</th>
                      <th className="py-2 px-3 text-center">Hasil Upload Link</th>
                      <th className="py-2 px-3 text-center">Verifikasi</th>
                      <th className="py-2 px-3 text-center">Komentar Staff</th>
                      <th className="py-2 px-3 text-center">Status Proses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCreative
                      .map((item, originalIndex) => ({ ...item, originalIndex }))
                      .filter((item) =>
                        item.periode?.toLowerCase().includes(searchPeriode.toLowerCase())
                      )
                      .map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-center">{item.periode || "-"}</td>
                        <td className="py-2 px-3 text-center">{item.pembina || "-"}</td>
                        <td className="py-2 px-3 text-center">{item.topik}</td>
                        <td className="py-2 px-3 text-center">{item.tanggalDiskusi}</td>
                        <td className="py-2 px-3 text-center">{item.mediaDiskusi}</td>
                        <td className="py-2 px-3 text-center">{item.hasilDiskusi}</td>
                        <td className="py-2 px-3 text-center">{item.status}</td>
                        <td className="py-2 px-3 text-center">
                          {item.linkIG ? (
                            <a
                              href={item.linkIG}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline break-words"
                            >
                              {item.linkIG}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => updateVerifikasiCreative(item.originalIndex, "setuju")}
                              className="text-green-600 text-xl transition-transform transform hover:scale-125 hover:rotate-12 cursor-pointer"
                            >
                              ✔️
                            </button>
                            <button
                              onClick={() => updateVerifikasiCreative(item.originalIndex, "tidak")}
                              className="text-red-600 text-xl transition-transform transform hover:scale-125 hover:-rotate-12 cursor-pointer"
                            >
                              ❌
                            </button>
                            <button
                              onClick={() => updateVerifikasiCreative(item.originalIndex, "decline")}
                              className="text-orange-600 text-xl transition-transform transform hover:scale-125 cursor-pointer"
                            >
                              🔁
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {item.statusVerifikasi === "Decline (Edit Ulang)" ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={item.komentarStaff || ""}
                                onChange={(e) => handleKomentarCreative(item.originalIndex, e.target.value)}
                                className="border rounded-lg p-2 w-full"
                                placeholder="Komentar revisi..."
                              />
                              <button
                                onClick={() => handleEditUlangCreative(item.originalIndex)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-sm"
                              >
                                Kirim Ulang
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={item.komentarStaff || ""}
                              onChange={(e) => handleKomentarCreative(item.originalIndex, e.target.value)}
                              className="border rounded-lg p-2 w-full"
                              placeholder="Tulis komentar..."
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {item.statusVerifikasi === "Disetujui" && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Disetujui
                            </span>
                          )}
                          {item.statusVerifikasi === "Tidak Disetujui" && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Tidak Disetujui
                            </span>
                          )}
                          {item.statusVerifikasi === "Decline (Edit Ulang)" && (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Revisi
                            </span>
                          )}
                          {(item.statusVerifikasi === undefined || item.statusVerifikasi === "Menunggu") && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Menunggu
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </>
        )}

        {/* PAGE: TARIK DATA REPORT */}
        {activePage === "report" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tarik Data Report</h1>
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Peran</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">-- Pilih Peran --</option>
                    <option value="Peer Counselor">Peer Counselor</option>
                    <option value="Peer Partner">Peer Partner</option>
                    <option value="Creative Team">Creative Team</option>
                  </select>
                </div>
              <div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Periode</label>
                  <input
                    type="text"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    placeholder="Contoh: 2023, 2024, atau 2025..."
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            </div>

              <button
                onClick={handleTarikData}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Tarik Data
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Hasil Data</h2>
              {riwayat.length === 0 ? (
                <p className="text-gray-500">Belum ada data yang sesuai.</p>
              ) : (
                <div className="max-h-[550px] overflow-y-auto rounded-lg border">
                <table className="min-w-full text-sm text-left border-collapse table-fixed w-full">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="border-b">
                      {columnsByRole[selectedRole]?.map((key) => (
                        <th
                          key={key}
                          className={`py-3 px-4 text-center font-semibold text-gray-900 border-b border-gray-200 ${
                            key === "linkIG" ? "w-48" : ""
                          }`}
                        >
                          {headerLabels[key]
                            ? headerLabels[key]
                            : key === "linkIG"
                            ? "Link Name"
                            : key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-gray-700 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayat.map((item, i) => (
                      <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                        {columnsByRole[selectedRole]?.map((key, j) => (
                          <td
                            key={j}
                            className={`py-2 px-4 text-center border-b border-gray-100 ${
                              key === "linkIG" ? "break-words" : ""
                            }`}
                          >
                            {typeof item[key] === "boolean"
                              ? item[key]
                                ? "✅"
                                : "❌"
                              : key.toLowerCase().includes("durasi") && item[key]
                              ? `${item[key]} menit`
                              : item[key] && item[key].toString().trim() !== ""
                              ? item[key].toString()
                              : "-"}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleExportSingleExcel(item)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm"
                          >
                            Export Excel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </>
        )}
        
        {/* PAGE: CHECKLIST PENGAMBILAN SOUVENIR */}
        {activePage === "souvenir" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Checklist Pengambilan Souvenir</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow"> 
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Data Checklist Souvenir Diterima</h1>

            {/* Search filter */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Search Periode */}
                <input
                  type="text"
                  placeholder="Cari Periode (contoh: 2025)"
                  className="border rounded-lg p-2 w-full"
                  value={searchSouvenirPeriode}
                  onChange={(e) => setSearchSouvenirPeriode(e.target.value)}
                />

                {/* Search NIM */}
                <input
                  type="text"
                  placeholder="Cari NIM"
                  className="border rounded-lg p-2 w-full"
                  value={searchSouvenirNim}
                  onChange={(e) => setSearchSouvenirNim(e.target.value)}
                />

                {/* Search Area Kampus */}
                <input
                  type="text"
                  placeholder="Cari Area Kampus (Kemanggisan, Alam Sutera, dll)"
                  className="border rounded-lg p-2 w-full"
                  value={searchSouvenirArea}
                  onChange={(e) => setSearchSouvenirArea(e.target.value)}
                />
              </div>

              {dataCounselor.length === 0 && dataPartner.length === 0 && dataCreative.length === 0 ? (
                <p className="text-gray-500">Belum ada data mahasiswa untuk pendataan souvenir.</p>
              ) : (
                <div className="max-h-[550px] overflow-y-auto rounded-lg border">
                <table className="min-w-full text-left text-sm text-left border-collapse table-fixed w-full">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="py-2 px-3 text-center">NIM</th>
                      <th className="py-2 px-3 text-center">Nama</th>
                      <th className="py-2 px-3 text-center">Jurusan</th>
                      <th className="py-2 px-3 text-center">Peran</th>
                      <th className="py-2 px-3 text-center">Area Kampus</th>
                      <th className="py-2 px-3 text-center">Fakultas</th>
                      <th className="py-2 px-3 text-center">Periode</th>
                      <th className="py-2 px-3 text-center">Souvenir Telah Diterima</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {souvenirList
                      .filter((item) => {
                        const periodeMatch =
                          searchSouvenirPeriode === "" ||
                          item.periode?.toString().includes(searchSouvenirPeriode);

                        const nimMatch =
                          searchSouvenirNim === "" ||
                          item.nim?.toLowerCase().includes(searchSouvenirNim.toLowerCase());

                        const areaMatch =
                          searchSouvenirArea === "" ||
                          item.area?.toLowerCase().includes(searchSouvenirArea.toLowerCase());

                        return periodeMatch && nimMatch && areaMatch;
                      })
                      .map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-center">{item.nim}</td>
                        <td className="py-2 px-3 text-center">{item.nama}</td>
                        <td className="py-2 px-3 text-center">{item.jurusan}</td>
                        <td className="py-2 px-3 text-center">{item.role}</td>
                        <td className="py-2 px-3 text-center">{item.area}</td>
                        <td className="py-2 px-3 text-center">{item.fakultas}</td>
                        <td className="py-2 px-3 text-center">{item.periode}</td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={item.souvenir}
                             onChange={(e) =>
                               handleSouvenirChange(item, e.target.checked)
                            }
                           />
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </>
        )}

        {/* PAGE: EVALUASI DAN KUESIONER */}
        {activePage === "evaluasi-kuesioner" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Evaluasi & Kuesioner</h2>

            <div className="bg-white p-5 rounded-xl shadow mb-6">
              <h3 className="text-lg font-semibold mb-3">Input Evaluasi</h3>

              <label className="font-semibold">Kategori</label>
              <select
                value={inputEval.role}
                onChange={(e) => setInputEval({ ...inputEval, role: e.target.value })}
                className="border p-2 w-full rounded mb-3"
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Peer Counselor">Peer Counselor</option>
                <option value="Peer Partner">Peer Partner</option>
                <option value="Creative Team">Creative Team</option>
              </select>

              <label className="font-semibold">Judul Evaluasi</label>
              <input
                name="title"
                value={inputEval.title}
                onChange={(e) => setInputEval({ ...inputEval, title: e.target.value })}
                className="border p-2 w-full rounded mb-3"
              />

              <label className="font-semibold">Link Evaluasi</label>
              <input
                name="link"
                value={inputEval.link}
                onChange={(e) => setInputEval({ ...inputEval, link: e.target.value })}
                className="border p-2 w-full rounded mb-3"
              />

              <button
                onClick={() => {
                  if (editIndexEval !== null) {

                    // Proses validasi wajib isi
                    if (!inputEval.role || !inputEval.title || !inputEval.link) {
                      Swal.fire({
                        icon: "warning",
                        title: "Kolom Belum Lengkap",
                        text: "Semua kolom pada form Evaluasi wajib diisi!",
                      });
                      return;
                    }

                    // proses konfirmasi
                    Swal.fire({
                      title: "Update Evaluasi?",
                      text: "Anda yakin ingin menyimpan perubahan ini?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Ya, Update",
                      cancelButtonText: "Batal",
                    }).then((result) => {
                      if (!result.isConfirmed) return;

                      const updated = { ...evalData };
                      updated.evaluations[editIndexEval] = inputEval;

                      setEvalData(updated);
                      localStorage.setItem("evaluationData", JSON.stringify(updated));

                      setEditIndexEval(null);
                      setInputEval({ title: "", link: "", role: "" });

                      Swal.fire({
                        icon: "success",
                        title: "Berhasil!",
                        text: "Evaluasi berhasil diperbarui.",
                      });
                    });

                  } else {
                    saveEvaluasi();
                  }
                }}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
              >
                {editIndexEval !== null ? "Update Evaluasi" : "Simpan Evaluasi"}
              </button>

                {evalData.evaluations.map((item, index) => (
                  <div key={index} className="mt-5 border p-4 rounded-lg bg-gray-50">

                    <div className="flex justify-between items-start">

                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-gray-500">Kategori: {item.role}</p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {item.link}
                        </a>
                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() => deleteEvaluasi(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Hapus
                        </button>

                        <button
                          onClick={() => {
                            setInputEval(item);
                            setEditIndexEval(index);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-3">Input Kuesioner</h3>

              <label className="font-semibold">Kategori</label>
              <select
                value={inputKues.role}
                onChange={(e) => setInputKues({ ...inputKues, role: e.target.value })}
                className="border p-2 w-full rounded mb-3"
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Peer Counselor">Peer Counselor</option>
                <option value="Peer Partner">Peer Partner</option>
                <option value="Creative Team">Creative Team</option>
              </select>

              <label className="font-semibold">Judul Kuesioner</label>
              <input
                name="title"
                value={inputKues.title}
                onChange={(e) => setInputKues({ ...inputKues, title: e.target.value })}
                className="border p-2 w-full rounded mb-3"
              />

              <label className="font-semibold">Link Kuesioner</label>
              <input
                name="link"
                value={inputKues.link}
                onChange={(e) => setInputKues({ ...inputKues, link: e.target.value })}
                className="border p-2 w-full rounded mb-3"
              />

              <button
                onClick={() => {
                  if (editIndexKues !== null) {

                    // Proses validasi wajib isi
                    if (!inputKues.role || !inputKues.title || !inputKues.link) {
                      Swal.fire({
                        icon: "warning",
                        title: "Kolom Belum Lengkap",
                        text: "Semua kolom pada form Kuesioner wajib diisi!",
                      });
                      return;
                    }

                    // Proses konfirmasi
                    Swal.fire({
                      title: "Update Kuesioner?",
                      text: "Anda yakin ingin menyimpan perubahan ini?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Ya, Update",
                      cancelButtonText: "Batal",
                    }).then((result) => {
                      if (!result.isConfirmed) return;

                      const updated = { ...evalData };
                      updated.questionnaires[editIndexKues] = inputKues;

                      setEvalData(updated);
                      localStorage.setItem("evaluationData", JSON.stringify(updated));

                      setEditIndexKues(null);
                      setInputKues({ title: "", link: "", role: "" });

                      Swal.fire({
                        icon: "success",
                        title: "Berhasil!",
                        text: "Kuesioner berhasil diperbarui.",
                      });
                    });

                  } else {
                    saveKuesioner();
                  }
                }}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
              >
                {editIndexKues !== null ? "Update Kuesioner" : "Simpan Kuesioner"}
              </button>

              {/* Daftar kuesioner yang tersimpan */}
              {evalData.questionnaires.map((item, index) => (
                <div key={index} className="mt-5 border p-4 rounded-lg bg-gray-50">

                  <div className="flex justify-between items-start">

                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-500">Kategori: {item.role}</p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {item.link}
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteKuesioner(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>

                      <button
                        onClick={() => {
                          setInputKues(item);
                          setEditIndexKues(index);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
