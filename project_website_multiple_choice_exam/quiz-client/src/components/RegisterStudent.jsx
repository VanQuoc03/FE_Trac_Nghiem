import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterStudent({ onRegister }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ten_hocsinh: name,
        tendangnhap: username,
        matkhau: password,
        email,
        phone,
      };

      const response = await axios.post("/api/hocsinh/register", payload);
      const { message } = response.data;

      if (message.includes("thành công")) {
        onRegister?.();
      } else {
        setError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-[#FFF0E5] flex items-center justify-center pt-20">
        <div className="bg-[#DBBA84] rounded-xl shadow-2xl px-10 py-8 w-full max-w-md">
          <h2 className="text-white text-2xl font-bold mb-4 text-center border-b border-white pb-2">
            ĐĂNG KÝ HỌC SINH
          </h2>
          {error && (
            <p className="text-red-600 bg-white px-3 py-2 rounded mb-3 text-sm text-center">
              {error}
            </p>
          )}
          <div>
            <div className="mb-4">
              <label className="text-white font-semibold text-sm block mb-1">
                Họ và tên:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-white font-semibold text-sm block mb-1">
                Tên đăng nhập:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-white font-semibold text-sm block mb-1">
                Mật khẩu:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-white font-semibold text-sm block mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-white font-semibold text-sm block mb-1">
                Số điện thoại:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none"
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded-full text-[#333] bg-[#D8AD73] font-bold transition ${
                loading ? "opacity-60" : "hover:bg-[#936222]"
              }`}
            >
              {loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
            </button>
          </div>
          <p className="text-black text-sm mt-4 text-center">
            Đã có tài khoản?{" "}
            <a href="/Login" className="font-semibold underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
}