import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        role === "student" ? "/api/hocsinh/login" : "/api/giaovien/login";
      const payload =
        role === "student"
          ? { tendangnhap: username, matkhau: password }
          : { tendangnhap_gv: username, matkhau_gv: password };

      const response = await axios.post(endpoint, payload);
      const { token, message } = response.data;

      if (message.includes("thành công")) {
        const userData = {
          role,
          token,
          id: role === "student" ? response.data.id_hocsinh : response.data.id_giaovien,
          tendangnhap: username, // Lưu tên đăng nhập
        };
        // Lưu userData vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="student">Học Sinh</option>
              <option value="teacher">Giáo Viên</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}