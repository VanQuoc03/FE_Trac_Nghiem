import React from "react";
import { useNavigate, Link } from "react-router-dom";
import banner from "../assets/banner.png";

const HomeNotLoggedIn = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen pt-[100px]">
      {/* Navbar */}
      <header className="bg-[#C7A36F] shadow-md rounded-full mx-auto w-[90%] max-w-screen-xl mt-4 px-8 py-3 flex items-center justify-between fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
        <div className="text-lg font-bold text-white">LOGO</div>
        <nav className="flex-1 flex justify-center space-x-8 text-sm font-medium">
          <Link to="/" className="hover:text-[#F1C27D] transition-all">
            TRANG CHỦ
          </Link>
          <Link to="/practice" className="hover:text-[#F1C27D] transition-all">
            ÔN TẬP
          </Link>
          <Link to="/join-exam" className="hover:text-[#F1C27D] transition-all">
            THAM GIA THI
          </Link>
          <Link to="/notifications" className="hover:text-[#F1C27D] transition-all">
            THÔNG BÁO
          </Link>
          <Link to="/contact" className="hover:text-[#F1C27D] transition-all">
            LIÊN HỆ
          </Link>
        </nav>
        <div className="relative">
          <button
            className="bg-[#C7A36F] text-white px-6 py-2 rounded-full shadow-lg hover:bg-yellow-500 transition-all"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className="relative w-full h-[500px]">
        <img src={banner} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Tham gia kỳ thi trực tuyến dễ dàng
          </h1>
          <p className="text-lg md:text-xl max-w-[600px] mb-6 drop-shadow">
            Đăng nhập để bắt đầu hành trình học tập và thi cử hiệu quả.
          </p>
          <button
            onClick={handleLogin}
            className="bg-[#C7A36F] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition"
          >
            Đăng nhập
          </button>
        </div>
      </div>

      {/* Vì sao chọn chúng tôi */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-[#C7A36F] mb-12">
          Tại sao chọn hệ thống của chúng tôi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Dễ sử dụng</h3>
            <p className="text-gray-600">Giao diện thân thiện, dễ thao tác cho học sinh.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Tự động chấm điểm</h3>
            <p className="text-gray-600">Chấm điểm nhanh chóng, chính xác và minh bạch.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#C7A36F] mb-2">Bảo mật cao</h3>
            <p className="text-gray-600">Hệ thống đảm bảo an toàn thông tin thi cử.</p>
          </div>
        </div>
      </div>

      {/* Về chúng tôi */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#C7A36F] mb-6">Về chúng tôi</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Hệ thống thi trực tuyến của chúng tôi được phát triển nhằm hỗ trợ học sinh
            trên toàn quốc luyện thi và kiểm tra trình độ nhanh chóng. Với giao diện dễ dùng,
            bảo mật cao và tính năng tự động chấm điểm, bạn sẽ có trải nghiệm thi cử mượt mà và hiệu quả.
          </p>
        </div>
      </div>

      {/* Đánh giá từ học sinh */}
      <div className="bg-[#fef9f5] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#C7A36F] mb-12">
            Học sinh nói gì về chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { name: "Ngọc Anh", comment: "Hệ thống dễ dùng, mình làm bài kiểm tra rất nhanh." },
              { name: "Tuấn", comment: "Thi online mà cảm giác rất thật, điểm chấm rõ ràng." },
              { name: "Linh", comment: "Mình thích phần thống kê kết quả sau thi, rất trực quan." },
            ].map((student, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <p className="italic text-gray-600 mb-2">"{student.comment}"</p>
                <p className="font-semibold text-[#C7A36F]">– {student.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#C7A36F] text-center mb-10">Câu hỏi thường gặp</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Thi online có an toàn không?</h4>
              <p className="text-gray-600">Có. Chúng tôi sử dụng bảo mật và chấm điểm tự động để đảm bảo công bằng.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Sau khi thi có xem điểm không?</h4>
              <p className="text-gray-600">Có, bạn có thể xem điểm và đáp án ngay sau khi nộp bài.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Hệ thống có miễn phí không?</h4>
              <p className="text-gray-600">Hiện tại toàn bộ tính năng đều miễn phí cho học sinh.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA cuối trang */}
      <div className="bg-[#C7A36F] text-white py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng chưa?</h2>
        <button
          onClick={handleLogin}
          className="bg-white text-[#C7A36F] font-semibold px-6 py-3 rounded hover:bg-yellow-100"
        >
          Đăng nhập để bắt đầu làm bài thi
        </button>
      </div>
    </div>
  );
};

export default HomeNotLoggedIn;
