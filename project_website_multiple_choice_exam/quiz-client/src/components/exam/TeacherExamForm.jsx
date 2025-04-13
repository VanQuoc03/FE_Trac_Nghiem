import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const TeacherExamForm = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giaovien, setGiaovien] = useState(null);
  const navigate = useNavigate();
  const API_DETHI = "/api/dethi";

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("giaovien"));
    if (profile) {
      setGiaovien(profile);
    }
  }, []);

  useEffect(() => {
    if (!giaovien) return;
    const fetchExams = async () => {
      try {
        const res = await axios.get(API_DETHI);

        // Lọc đề thi theo giáo viên
        const filtered = res.data.filter(
          (dethi) => dethi.giaovien?.id_giaovien === giaovien.id_giaovien
        );

        setExams(filtered);
      } catch (error) {
        console.error("Lỗi khi tải đề thi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [giaovien]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tất cả đề thi của giáo viên</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : exams.length === 0 ? (
        <p>Không có đề thi nào.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">STT</th>
              <th className="border p-2">Tên đề thi</th>
              <th className="border p-2">Ngày tạo</th>
              <th className="border p-2">Môn học</th>
              <th className="border p-2">Thời gian thi</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={exam.id_dethi} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2 font-semibold">{exam.tendethi}</td>
                <td className="border p-2">
                  {new Date(exam.ngay_tao).toLocaleDateString("vi-VN")}
                </td>
                <td className="border p-2">{exam.monhoc?.tenmonhoc}</td>
                <td className="border p-2">{exam.thoigianthi} phút</td>
                <td
                  className={`border p-2 font-medium ${
                    exam.trangthai === "hoanthanh"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {exam.trangthai}
                </td>
                <td className="border p-2">
                  <Link
                    className="text-blue-500 mr-2 hover:underline"
                    to={`/exam/${exam.id_dethi}`}
                  >
                    Chi tiết
                  </Link>
                  <button
                    className="text-blue-500 mr-2 hover:underline"
                    onClick={() => navigate(`/dethi/edit/${exam.id_dethi}`)}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherExamForm;