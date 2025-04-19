import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RoleSelection() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = () => {
    if (role === "student") {
      navigate("/RegisterStudent");
    } else if (role === "teacher") {
      navigate("/RegisterTeacher");
    }
  };

  return (
    <>
    <header className="bg-[#C7A36F] shadow-md rounded-full mx-auto w-[90%] max-w-screen-xl mt-4 px-8 py-3 flex items-center justify-between fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
      <div className="text-lg font-bold">LOGO</div>
      <nav className="flex-1 flex justify-center space-x-6 text-sm font-medium">
        <Link to="/" className="hover:underline">
          TRANG CHỦ
        </Link>
        <Link to="/practice" className="hover:underline">
          ÔN TẬP
        </Link>
        <Link to="/join-exam" className="hover:underline">
          THAM GIA THI
        </Link>
        {/* <Link to="/subjects" className="hover:underline">
          MÔN THI
        </Link> */}
        <Link to="/notifications" className="hover:underline">
          THÔNG BÁO
        </Link>
        <Link to="/contact" className="hover:underline">
          LIÊN HỆ
        </Link>
      </nav>
      <div className="relative">
        <button
          className="bg-[#C7A36F] text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </div>
    </header>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0E5] to-[#FDEBD2] flex items-center justify-center">
        <div className="bg-[#DBBA84] rounded-2xl shadow-xl px-10 py-10 w-full max-w-md">
          <h2 className="text-white text-3xl font-bold mb-6 text-center border-b border-white pb-3">
            CHỌN VAI TRÒ
          </h2>

          <div className="mb-6">
            <label className="text-white font-semibold text-lg block mb-2">
              Bạn là:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-[#333] focus:outline-none focus:ring-2 focus:ring-white font-medium"
            >
              <option value="" disabled>-- Vui lòng chọn vai trò --</option>
              <option value="student">🎓 Học sinh</option>
              <option value="teacher">👨‍🏫 Giáo viên</option>
            </select>
          </div>

          <button
            onClick={handleRoleSelect}
            disabled={!role}
            className={`w-full py-3 rounded-full text-white font-bold text-lg transition ${
              !role
                ? "bg-[#D8AD73] opacity-50 cursor-not-allowed"
                : "bg-[#936222] hover:bg-[#7a4f1c]"
            }`}
          >
            TIẾP TỤC
          </button>
        </div>
      </div>
    </>
  );
}
