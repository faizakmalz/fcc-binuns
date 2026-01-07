import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserRole, getAllPembina } from "../utils/supabaseHelpers";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [campus, setCampus] = useState("");
  const [pembina, setPembina] = useState("");
  const [periode, setPeriode] = useState("");
  const [jurusan, setJurusan] = useState(""); 
  const [fakultas, setFakultas] = useState(""); 
  const [area, setArea] = useState(""); 
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function getPembinaList() {
      const pembinaList = await getAllPembina();
      return pembinaList.data;
    }
    getPembinaList().then((data) => {
      if (data && data.length > 0) {
        localStorage.setItem("pembinaList", JSON.stringify(data));
        setPembina(data);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    
    if (!role) newErrors.role = "Harap pilih peran terlebih dahulu!";
    if (!periode) newErrors.periode = "Periode harus diisi!";
    if (!jurusan) newErrors.jurusan = "Jurusan harus diisi!";
    if (!fakultas) newErrors.fakultas = "Fakultas harus diisi!";

    if ((role === "peer-counselor" || role === "peer-partner") && !campus)
      newErrors.campus = "Harap pilih kampus terlebih dahulu!";

    if (role === "creative-team" && !pembina)
      newErrors.pembina = "Harap pilih pembina terlebih dahulu!";

    if (role === "creative-team" && !area)
      newErrors.area = "Area harus diisi untuk Creative Team!";

    setErrors(newErrors);
    console.log("Validasi errors:", newErrors);
    if (Object.keys(newErrors).length === 0 && user) {
      setLoading(true);
      
      const roleMap = {
        "peer-counselor": "Peer Counselor",
        "peer-partner": "Peer Partner",
        "creative-team": "Creative Team"
      };

      const roleDataObj = {
        user_id: user.id, 
        nim: user.nim,
        nama: user.nama,
        jurusan,
        area: role === "creative-team" ? area : campus, 
        fakultas,
        periode: parseInt(periode),
        role: roleMap[role],
        pembina_id: role === "creative-team" ? pembina : null,
      };

      const result = await updateUserRole(user.id, roleDataObj);

      if (result.success) {
        localStorage.setItem("roleData", JSON.stringify(roleDataObj));
        
        if (role === "peer-counselor") navigate("/peer-counselor");
        else if (role === "peer-partner") navigate("/peer-partner");
        else if (role === "creative-team") navigate("/creative-team");
      } else {
        alert("Gagal menyimpan role: " + result.error);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 to-blue-500">
      <div className="bg-gray-100 shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-5 text-black-300">
          Pilih Peran
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Peran</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setErrors({ ...errors, role: "" });
              }}
              className={`w-full p-2 border rounded-lg ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Pilih Peran --</option>
              <option value="peer-counselor">Peer Counselor</option>
              <option value="peer-partner">Peer Partner</option>
              <option value="creative-team">Creative Team</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Jurusan</label>
            <input
              type="text"
              placeholder="Masukkan jurusan"
              value={jurusan}
              onChange={(e) => {
                setJurusan(e.target.value);
                setErrors({ ...errors, jurusan: "" });
              }}
              className={`w-full p-2 border rounded-lg ${
                errors.jurusan ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.jurusan && <p className="text-red-500 text-sm mt-1">{errors.jurusan}</p>}
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Fakultas</label>
            <input
              type="text"
              placeholder="Masukkan fakultas"
              value={fakultas}
              onChange={(e) => {
                setFakultas(e.target.value);
                setErrors({ ...errors, fakultas: "" });
              }}
              className={`w-full p-2 border rounded-lg ${
                errors.fakultas ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fakultas && <p className="text-red-500 text-sm mt-1">{errors.fakultas}</p>}
          </div>

          {(role === "peer-counselor" || role === "peer-partner") && (
            <div>
              <label className="block text-gray-900 font-medium mb-1">Kampus</label>
              <select
                value={campus}
                onChange={(e) => {
                  setCampus(e.target.value);
                  setErrors({ ...errors, campus: "" });
                }}
                className={`w-full p-2 border rounded-lg ${
                  errors.campus ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Pilih Kampus --</option>
                <option value="KG">Kemanggisan (KG)</option>
                <option value="AS">Alam Sutera (AS)</option>
                <option value="BKS">Bekasi (BKS)</option>
                <option value="BDG">Bandung (BDG)</option>
                <option value="MLG">Malang (MLG)</option>
                <option value="SMG">Semarang (SMG)</option>
                <option value="MDN">Medan (MDN)</option>
              </select>
              {errors.campus && (
                <p className="text-red-500 text-sm mt-1">{errors.campus}</p>
              )}
            </div>
          )}

          {role === "creative-team" && (
            <>
              <div>
                <label className="block text-gray-900 font-medium mb-1">Pembina</label>
                <select
                  value={pembina}
                  onChange={(e) => {
                    setPembina(e.target.value);
                    setErrors({ ...errors, pembina: "" });
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    errors.pembina ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Pilih Pembina --</option>
                  
                  {(JSON.parse(localStorage.getItem("pembinaList")) || []).map((p, i) => (
                    <option key={i} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
                
                {errors.pembina && (
                  <p className="text-red-500 text-sm mt-1">{errors.pembina}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1">Area</label>
                <input
                  type="text"
                  placeholder="Masukkan area (Kemanggisan, Alam Sutera, dll.)"
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    setErrors({ ...errors, area: "" });
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    errors.area ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
            </>
          )}

          <div className="text-center">
            <label className="block text-gray-900 font-medium mb-1">
              Periode Peran
            </label>
            <div className="flex items-center justify-center space-x-2">
              <input
                type="number"
                placeholder="Contoh: 2025"
                value={periode}
                onChange={(e) => {
                  setPeriode(e.target.value);
                  setErrors({ ...errors, periode: "" });
                }}
                className={`p-2 border rounded-lg text-center ${
                  errors.periode ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.periode && (
              <p className="text-red-500 text-sm mt-1">{errors.periode}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-300 text-black p-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Lanjutkan ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}