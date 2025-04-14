import React from "react";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/banner.png";

const Home = () => {
  const navigate = useNavigate();

  const handleJoinExam = () => {
    navigate("/join-exam");
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen pt-[100px]">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[500px]">
        <img
          src={banner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Sẵn sàng cho kỳ thi trực tuyến
          </h1>
          <p className="text-lg md:text-xl max-w-[600px] mb-6 drop-shadow">
            Nền tảng hỗ trợ học sinh thi hiệu quả, nhanh chóng và bảo mật.
          </p>
          <button
            onClick={handleJoinExam}
            className="bg-[#C7A36F] text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            Thi ngay
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-[#C7A36F] mb-10">
          Tại sao chọn hệ thống của chúng tôi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Dễ dàng sử dụng</h3>
            <p className="text-gray-600">
              Giao diện thân thiện, dễ thao tác cho học sinh trong các kỳ thi.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Tự động chấm điểm</h3>
            <p className="text-gray-600">
              Chấm điểm nhanh chóng, chính xác và minh bạch.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Bảo mật dữ liệu</h3>
            <p className="text-gray-600">
              Hệ thống đảm bảo an toàn thông tin và công bằng trong thi cử.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;

