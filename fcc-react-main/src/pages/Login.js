import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fccLogo from "../Assets/Logo-FCC.png";
import { loginUser } from "../utils/supabaseHelpers";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Akun staff (hardcoded untuk keamanan)
  const staffAccounts = [
    { username: "admin", password: "123456" },
    { username: "staff1", password: "654321" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    if (!username) {
      setMessage({ text: "Username harus diisi!", type: "error" });
      setLoading(false);
      return;
    }

    if (!password) {
      setMessage({ text: "Password harus diisi!", type: "error" });
      setLoading(false);
      return;
    }

    // Check if staff account
    const staff = staffAccounts.find(
      (s) => s.username === username && s.password === password
    );
    
    if (staff) {
      setMessage({ text: "Login sebagai Staff berhasil!", type: "success" });
      setTimeout(() => {
        setLoading(false);
        navigate("/sasc-staff");
      }, 1500);
      return;
    }

    // Check student account from Supabase
    const result = await loginUser(username, password);
    
    if (result.success && result.data) {
      const userData = result.data;
      console.log(userData, 'USERDATA'); // Untuk debug
      
      // Simpan user data lengkap ke localStorage (termasuk roleData jika ada)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id, // Tambah id untuk updateUserRole
          username: userData.username,
          nama: userData.nama,
          nim: userData.nim,
          hasRole: userData.hasRole,
          roleData: userData.roleData // Simpan roleData lengkap
        })
      );

      // Simpan juga untuk backward compatibility (opsional)
      localStorage.setItem("userName", userData.nama);
      localStorage.setItem("userNIM", userData.nim);

      setMessage({ text: "Login sebagai Student berhasil!", type: "success" });
      
      // Redirect berdasarkan apakah user sudah punya role atau belum
      setTimeout(() => {
        setLoading(false);
        console.log(userData, 'USERDATA AFTER LOGIN'); // Untuk debug
        if (userData.hasRole && userData.roleData) {
          // User sudah punya role, langsung ke dashboard role
          const role = userData.roleData.role; // Akses dari roleData
          const roleRoutes = {
            "Peer Counselor": "/peer-counselor",
            "Peer Partner": "/peer-partner",
            "Creative Team": "/creative-team"
          };
          
          // Simpan roleData untuk digunakan di dashboard (format seperti sebelumnya)
          localStorage.setItem("roleData", JSON.stringify({
            role: role.toLowerCase().replace(" ", "-"), // peer-counselor, dll.
            campus: userData.roleData.area, // Area = campus untuk counselor/partner
            pembina: userData.roleData.pembina || null, // Hanya untuk creative
            periode: userData.roleData.periode,
            jurusan: userData.roleData.jurusan,
            fakultas: userData.roleData.fakultas
          }));
          
          navigate(roleRoutes[role] || "/role-selection");
        } else {
          // User belum punya role, arahkan ke role selection
          navigate("/role-selection");
        }
      }, 1500);
    } else {
      setMessage({ text: "Username atau password salah!", type: "error" });
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${fccLogo})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-white/70"></div>
      <div className="relative bg-white rounded-2xl shadow-lg p-8 w-[380px] border-t-4 border-blue-500 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {message.text && (
          <div
            className={`p-2 text-sm rounded-md mb-3 text-center ${
              message.type === "error"
                ? "bg-red-100 text-red-600 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-2">
          <span 
            onClick={() => !loading && navigate("/")} 
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Kembali ke Home
          </span>
        </p>
      </div>
    </div>
  );
}