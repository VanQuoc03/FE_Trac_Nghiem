import React, { useState, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation, Outlet } from "react-router-dom";

const NavbarTeacher = ({ onLogout }) => {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teacherMenuOpen, setTeacherMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
      setTeacherMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: "/teacher", label: "Trang Chủ" },
    { path: "/teacher/exams", label: "Thi Thử" },
    { path: "/teacher/subjects", label: "Môn Thi" },
    // Removed undefined routes: "Ôn Tập", "Thông Báo", "Liên Hệ"
  ];

  return (
    <>
      <nav className="bg-[#D9B384] flex rounded-lg p-3 shadow-lg w-full mx-auto">
        <div className="text-3xl font-bold px-4">Logo</div>
        <div className="space-x-11 text-sm p-3">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`transition-all ${
                location.pathname === item.path
                  ? "font-bold border-b-2 border-white"
                  : "hover:font-bold hover:border-b-2 hover:border-white"
              }`}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex ml-auto gap-2">
          <div className="relative flex justify-end mr-10">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="p-1 rounded-md border text-sm px-3 w-[600px]"
            />
            <CiSearch className="absolute m-3 size-5" />
          </div>
          <div className="relative flex items-center gap-3" ref={menuRef}>
            <button
              className="bg-white px-3 py-1 rounded-full text-sm flex items-center justify-around w-[50px] h-[50px]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaRegUser className="size-7" />
            </button>
            <IoMdArrowDropdown />
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-md p-2 z-50">
                <Link
                  to="/teacher/create-exam"
                  onClick={() => setMenuOpen(false)}
                  className="block p-2 hover:bg-gray-200"
                >
                  Tạo bài thi
                </Link>
                <hr className="border-1 border-black" />
                <div className="relative">
                  <button
                    onClick={() => setTeacherMenuOpen(!teacherMenuOpen)}
                    className="w-full text-left p-2 hover:bg-gray-200 flex justify-between items-center"
                  >
                    Giáo viên <IoMdArrowDropdown />
                  </button>
                  {teacherMenuOpen && (
                    <div className="mt-[-20px] ml-[-230px] bg-white shadow-xl rounded-md p-2 z-50 w-56 absolute left-0">
                      <Link
                        to="/teacher/profile"
                        onClick={() => {
                          setMenuOpen(false);
                          setTeacherMenuOpen(false);
                        }}
                        className="block p-2 hover:bg-gray-200"
                      >
                        Trang cá nhân
                      </Link>
                      <Link
                        to="/teacher/exams"
                        onClick={() => {
                          setMenuOpen(false);
                          setTeacherMenuOpen(false);
                        }}
                        className="block p-2 hover:bg-gray-200"
                      >
                        Quản lý đề thi
                      </Link>
                      <Link
                        to="/teacher/exams/by-exam"
                        onClick={() => {
                          setMenuOpen(false);
                          setTeacherMenuOpen(false);
                        }}
                        className="block p-2 hover:bg-gray-200"
                      >
                        Bài thi theo đề
                      </Link>
                      <Link
                        to="/teacher/exams/by-date"
                        onClick={() => {
                          setMenuOpen(false);
                          setTeacherMenuOpen(false);
                        }}
                        className="block p-2 hover:bg-gray-200"
                      >
                        Bài thi theo ngày
                      </Link>
                      {/* Removed undefined route: "Thống kê điểm số" */}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="block p-2 hover:bg-gray-200 w-full text-left"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Outlet /> {/* This renders the child routes (e.g., CreateExam, HomePage) */}
    </>
  );
};

export default NavbarTeacher;