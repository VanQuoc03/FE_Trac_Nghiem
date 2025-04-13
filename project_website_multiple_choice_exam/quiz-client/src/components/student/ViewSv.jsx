import { useAppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ViewSv() {
  const { databaithi, loading } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getRating = (score) => {
    if (score >= 9) return "⭐⭐⭐⭐⭐";
    if (score >= 7) return "⭐⭐⭐⭐";
    if (score >= 5) return "⭐⭐⭐";
    if (score >= 3) return "⭐⭐";
    return "⭐";
  };

  const filteredData = databaithi.filter(
    (item) =>
      item.id_baithi.toString().includes(searchTerm) ||
      item.ngaylam.includes(searchTerm) ||
      item.trangthai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Lịch sử bài thi</h1>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm theo ID, ngày làm, trạng thái..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr className="bg-[#C7A36F] text-black">
                <th className="border border-gray-300 px-4 py-3">ID</th>
                <th className="border border-gray-300 px-4 py-3">ID Học Sinh</th>
                <th className="border border-gray-300 px-4 py-3">ID Đề Thi</th>
                <th className="border border-gray-300 px-4 py-3">Ngày Làm</th>
                <th className="border border-gray-300 px-4 py-3">Trạng Thái</th>
                <th className="border border-gray-300 px-4 py-3">Điểm Thi</th>
                <th className="border border-gray-300 px-4 py-3">Đánh Giá</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id_baithi}
                    className="hover:bg-gray-200 text-center cursor-pointer transition duration-200"
                    onClick={() =>
                      navigate(`/detail/${item.id_baithi}`, {
                        state: { studentInfo: item.hocsinh },
                      })
                    }
                  >
                    <td className="border border-gray-300 px-4 py-2">{item.id_baithi}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.hocsinh?.id_hocsinh}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.dethi?.id_dethi}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.ngaylam}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs 
                          ${item.trangthai === "Hoàn thành" ? "bg-red-500" : "bg-green-500"}`}
                      >
                        {item.trangthai}
                      </span>
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold 
                        ${item.diemthi >= 9 ? "text-green-600" : item.diemthi >= 7 ? "text-blue-600" : item.diemthi >= 5 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {item.diemthi}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{getRating(item.diemthi)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}