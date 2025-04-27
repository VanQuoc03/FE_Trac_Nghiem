import axios from "axios";
import React, { use, useEffect, useState } from "react";
const BaiThiTheoNgay = () => {
  const [ngay, setNgay] = useState("");
  const [baiThi, setBaiThi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [giaovien, setGiaovien] = useState(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("giaovien"));
    if (profile) {
      setGiaovien(profile);
    }
  }, []);

  useEffect(() => {
    const fetchBaiThi = async () => {
      const profile = JSON.parse(localStorage.getItem("giaovien"));
      if (!profile || !ngay) return;

      setGiaovien(profile);
      setLoading(true);

      try {
        const res = await axios.get("https://quiz-api-34vp.onrender.com/api/baithi");
        const filtered = res.data.filter((baiThi) => {
          const ngayLam = new Date(baiThi.ngaylam).toISOString().slice(0, 10);
          const selectedDate = new Date(ngay).toISOString().slice(0, 10);
          return (
            baiThi.dethi.id_giaovien === profile.id_giaovien &&
            ngayLam === selectedDate
          );
        });

        setBaiThi(filtered);
      } catch (err) {
        console.log("Lỗi khi lọc bài thi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBaiThi();
  }, [ngay]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Tra cứu bài thi theo ngày
      </h2>
      {giaovien && (
        <p className="text-center mb-6 text-gray-700">
          Giáo viên:{" "}
          <span className="font-semibold text-blue-600">
            {giaovien.ten_giaovien}
          </span>
        </p>
      )}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          className="p-2 rounded-md border shadow-sm"
          value={ngay}
          onChange={(e) => setNgay(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
      ) : baiThi.length === 0 ? (
        <p className="text-center text-gray-600">
          Không có bài thi nào trong ngày này
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-center">
                <th className="px-4 py-2 border">STT</th>
                <th className="px-4 py-2 border">Tên học sinh</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Điểm</th>
                <th className="px-4 py-2 border">Trạng thái</th>
                <th className="px-4 py-2 border">Ngày làm</th>
              </tr>
            </thead>
            <tbody>
              {baiThi.map((baiThi, index) => (
                <tr
                  key={baiThi.id_baithi}
                  className="text-center hover:bg-gray-50 text-sm"
                >
                  <th className="px-4 py-2 border">{index + 1}</th>
                  <th className="px-4 py-2 border">
                    {baiThi.hocsinh.ten_hocsinh}
                  </th>
                  <th className="px-4 py-2 border">{baiThi.hocsinh.email}</th>
                  <th className="px-4 py-2 border">{baiThi.diemthi}</th>
                  <th className="px-4 py-2 border">{baiThi.trangthai}</th>
                  <th className="px-4 py-2 border">
                    {new Date(baiThi.ngaylam).toLocaleDateString("vi-VN")}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BaiThiTheoNgay;
