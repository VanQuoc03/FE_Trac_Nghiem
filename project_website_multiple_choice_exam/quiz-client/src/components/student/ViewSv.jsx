import { useAppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ViewSv() {
  const { databaithi, loading } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(""); // Thêm state cho ngày

  // ✅ Lấy thông tin đăng nhập từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const tendangnhap = user?.tendangnhap || "";

  // ✅ Hàm đánh giá theo điểm
  const getRating = (score) => {
    if (score >= 9) return "⭐⭐⭐⭐⭐";
    if (score >= 7) return "⭐⭐⭐⭐";
    if (score >= 5) return "⭐⭐⭐";
    if (score >= 3) return "⭐⭐";
    return "⭐";
  };

  // ✅ Chuẩn hóa ngày về yyyy-mm-dd
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ✅ Lọc dữ liệu theo tài khoản và điều kiện tìm kiếm
  const filteredData = databaithi.filter(
    (item) =>
      item.hocsinh?.tendangnhap === tendangnhap &&
      (
        item.id_baithi.toString().includes(searchTerm) ||
        item.trangthai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dethi?.tendethi.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Tìm theo tên đề thi
      ) &&
      (searchDate ? formatDate(item.ngaylam) === searchDate : true)
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(10); // Số mục mỗi trang

  const indexOfLastItem = currentPage * itemsPerPage; // Vị trí của mục cuối cùng trên trang
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Vị trí của mục đầu tiên trên trang
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem); // Dữ liệu hiển thị trên trang hiện tại

  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // Tổng số trang

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans pt-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Lịch sử bài thi</h1>

      <input
        type="text"
        placeholder="🔍 Tìm theo ID, trạng thái hoặc tên đề thi..."
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
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
                <th className="border border-gray-300 px-4 py-3">Tên Đề Thi</th>
                <th className="border border-gray-300 px-4 py-3">Ngày Làm</th>
                <th className="border border-gray-300 px-4 py-3">Trạng Thái</th>
                <th className="border border-gray-300 px-4 py-3">Điểm Thi</th>
                <th className="border border-gray-300 px-4 py-3">Đánh Giá</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
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
                    <td className="border border-gray-300 px-4 py-2">{item.dethi?.tendethi}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(item.ngaylam)}</td>
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

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 border rounded-l-md bg-blue-600 text-white"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 border rounded-r-md bg-blue-600 text-white"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}