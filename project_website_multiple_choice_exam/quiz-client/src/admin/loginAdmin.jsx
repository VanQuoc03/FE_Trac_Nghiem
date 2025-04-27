import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://quiz-api-34vp.onrender.com/api/admin/login", {
        login: login.trim(),
        pass: pass.trim(),
      });

      const { token } = res.data;
      localStorage.setItem("user", JSON.stringify({ token }));
      navigate("/HomeAdmin");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Không thể kết nối đến server.");
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0E5] flex items-center justify-center p-4">
      <div className="bg-[#DBBA84] rounded-xl shadow-2xl px-8 py-10 w-full max-w-md">
        <h2 className="text-white text-3xl font-bold mb-6 text-center border-b border-white/50 pb-3">
          ĐĂNG NHẬP ADMIN
        </h2>

        {error && (
          <div className="bg-white/90 text-red-600 text-sm font-medium px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="text-white font-semibold text-sm block mb-2">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C7A36F]"
            />
          </div>

          <div className="mb-6">
            <label className="text-white font-semibold text-sm block mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-full bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C7A36F]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white bg-[#C7A36F] font-bold transition flex items-center justify-center ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#A68B5A]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              "ĐĂNG NHẬP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
