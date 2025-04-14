import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.tendangnhap || "Học Sinh";

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.clear(); // Xóa toàn bộ localStorage
    onLogout();
    navigate("/login");
  };

  return (
    <>
      <header className="bg-[#C7A36F] shadow-md rounded-full mx-auto w-[90%] max-w-screen-xl mt-4 px-8 py-3 flex items-center justify-between">
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
            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-md hover:bg-gray-100"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>Welcome back, {username}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Thông tin tài khoản
              </Link>
              <Link
                to="/"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Lịch Sử Thi
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Cài đặt
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}