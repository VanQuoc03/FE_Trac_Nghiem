import React from "react";
import { useNavigate, Link } from "react-router-dom";
import banner from "../assets/banner.png";

const HomeNotLoggedIn = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); 
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

      <div className="font-sans bg-gray-100 min-h-screen pt-[100px]">
        <div className="relative w-full h-[500px]">
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Tham gia kỳ thi trực tuyến dễ dàng
            </h1>
            <p className="text-lg md:text-xl max-w-[600px] mb-6 drop-shadow">
              Đăng nhập để bắt đầu hành trình học tập và thi cử hiệu quả.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogin}
                className="bg-[#C7A36F] text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-12 px-6">
          <h2 className="text-3xl font-bold text-center text-[#C7A36F] mb-10">
            Lợi ích khi đăng nhập hệ thống
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Truy cập đề thi</h3>
              <p className="text-gray-600">
                Học sinh được phép truy cập vào các đề thi phù hợp theo lớp và môn học.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Kết quả minh bạch</h3>
              <p className="text-gray-600">
                Hệ thống tự động chấm điểm và hiển thị kết quả ngay lập tức.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Bảo mật và riêng tư</h3>
              <p className="text-gray-600">
                Tài khoản cá nhân và thông tin thi cử được bảo vệ nghiêm ngặt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeNotLoggedIn;
