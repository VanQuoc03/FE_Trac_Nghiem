import { BellRing, CheckCircle, AlertTriangle } from "lucide-react"; 
import React, { useState } from "react";
import clsx from "clsx";
import { useAppContext } from "../../Context/AppContext";


const iconMap = {
  success: <CheckCircle className="text-green-500" size={24} />,
  warning: <AlertTriangle className="text-yellow-500" size={24} />,
  info: <BellRing className="text-blue-500" size={24} />,
};

const bgMap = {
  success: "bg-green-50 border-green-300",
  warning: "bg-yellow-50 border-yellow-300",
  info: "bg-blue-50 border-blue-300",
};

export default function ThongBao() {
  const { databaithi } = useAppContext(); // Lấy dữ liệu từ AppContext
  const [expandedId, setExpandedId] = useState(null);

  // Lọc tất cả học sinh có điểm >= 5 và tạo thông báo chúc mừng
  const topScorers = databaithi
    .filter((item) => item.diemthi >= 5) // Lọc học sinh có điểm >= 5
    .map((item, index) => ({
      id: index,
      type: "success",
      title: `🎉 Chúc mừng ${item.hocsinh?.ten_hocsinh}`, // Tiêu đề chúc mừng
      content: `Tài khoản: ${item.hocsinh?.taikhoan} đã đạt ${item.diemthi}/10 trong bài thi "${item.dethi?.tendethi}" vào ngày ${new Date(item.ngaylam).toLocaleDateString()}.`, // Nội dung thông báo với tài khoản
      date: new Date(item.ngaylam).toLocaleDateString(), // Ngày thi
    }));

  const toggleContent = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id)); // Toggle nội dung khi click
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#C7A36F]">🔔 Bảng Thông Báo</h1>
      <div className="space-y-4">
        {topScorers.length > 0 ? (
          topScorers.map((tb) => (
            <div
              key={tb.id}
              onClick={() => toggleContent(tb.id)} // Toggle nội dung khi click
              className={clsx(
                "cursor-pointer flex flex-col gap-2 p-4 rounded-lg border shadow-md hover:shadow-lg transition",
                bgMap[tb.type] // Áp dụng màu nền và border cho từng loại thông báo
              )}
            >
              <div className="flex items-start gap-4">
                <div className="pt-1">{iconMap[tb.type]}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{tb.title}</h2>
                    <span className="text-sm text-gray-500">{tb.date}</span>
                  </div>
                </div>
              </div>
              {expandedId === tb.id && (
                <p className="text-gray-700 pl-10">{tb.content}</p> // Hiển thị nội dung thông báo khi click
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Hiện tại chưa có ai đạt điểm cao trong bài thi.</p>
        )}
      </div>
    </div>
  );
}
