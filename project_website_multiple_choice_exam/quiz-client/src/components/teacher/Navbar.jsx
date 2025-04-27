import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";

const NavbarTeacher = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teacherMenuOpen, setTeacherMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.tendangnhap || "Giáo Viên";

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
      setTeacherMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Xóa toàn bộ localStorage
    onLogout();
    navigate("/login");
  };

  const navItems = [
    { path: "/teacher", label: "Trang Chủ" },
    { path: "/teacher/exams", label: "Thi Thử" },
    { path: "/teacher/subjects", label: "Môn Thi" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-6xl backdrop-blur-md bg-[#C7A36F] shadow-md rounded-2xl px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="text-lg font-semibold text-white tracking-wide">QuizZone</div>

        {/* Nav links */}
        <div className="flex gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-all ${location.pathname === item.path
                ? "text-white font-semibold border-b-2 border-white"
                : "text-white/80 hover:text-white hover:bg-gray-100 no-underline"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User section */}
        <div className="relative flex items-center gap-2" ref={menuRef}>
          <button
            className="flex items-center gap-2 bg-white/90 text-[#D9B384] px-3 py-1 rounded-full hover:bg-white transition-all text-sm"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaRegUser className="text-lg" />
            <span>{username}</span>
            <IoMdArrowDropdown />
          </button>
          {menuOpen && (
            <div
              className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-xl z-50 animate-fade-in"
              style={{ minWidth: "12rem" }}
            >
              <Link
                to="/teacher/create-exam"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100 no-underline"
              >
                Tạo bài thi
              </Link>
              <hr className="my-1" />
              <div>
                <button
                  onClick={() => setTeacherMenuOpen(!teacherMenuOpen)}
                  className="w-full px-4 py-2 flex justify-between items-center hover:bg-gray-100"
                >
                  Giáo viên <IoMdArrowDropdown />
                </button>
                {teacherMenuOpen && (
                  <div className="px-4 pt-1 pb-2">
                    <Link
                      to="/teacher/profile"
                      className="block py-1 hover:text-[#D9B384] no-underline hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setTeacherMenuOpen(false);
                      }}
                    >
                      Trang cá nhân
                    </Link>
                    <Link
                      to="/teacher/exams"
                      className="block py-1 hover:text-[#D9B384] no-underline hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setTeacherMenuOpen(false);
                      }}
                    >
                      Quản lý đề thi
                    </Link>
                    <Link
                      to="/teacher/exams/by-exam"
                      className="block py-1 hover:text-[#D9B384] no-underline hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setTeacherMenuOpen(false);
                      }}
                    >
                      Bài thi theo đề
                    </Link>
                    <Link
                      to="/teacher/exams/by-date"
                      className="block py-1 hover:text-[#D9B384] no-underline hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setTeacherMenuOpen(false);
                      }}
                    >
                      Bài thi theo ngày
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 no-underline"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default NavbarTeacher;
