import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ExamDetail = () => {
  const navigate = useNavigate();
  const { id_dethi } = useParams();
  const [exam, setExam] = useState(null);
  const API = `/api/dethi/${id_dethi}`;

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(API);
        setExam(res.data);
      } catch (error) {
        console.log("Lỗi khi lấy chi tiết đề thi", error);
      }
    };
    fetchExam();
  }, [id_dethi]);
  if (!exam) return <div className="text-center mt-10">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 shadow rounded bg-white">
      <h1 className="text-2xl font-bold mb-4">
        Chi tiết đề thi: {exam.id_dethi}
      </h1>
      <p>
        <strong>Ngày tạo: </strong>
        {new Date(exam.ngay_tao).toLocaleDateString("vi-VN")}
      </p>
      <p>
        <strong>Môn thi: </strong>
        {exam.monhoc.tenmonhoc}
      </p>
      <p>
        <strong>Thời gian thi: </strong>
        {exam.thoigianthi}
      </p>
      <p>
        <strong>Trạng thái: </strong>
        {exam.trangthai}
      </p>
      <p>
        <strong>Giáo viên: </strong>
        {exam.giaovien.ten_giaovien}
      </p>
      <div className="mt-6 flex space-x-4">
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
          onClick={() => navigate(`/dethi/edit/${exam.id_dethi}`)}
        >
          Sửa
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Xóa
        </button>
      </div>
    </div>
  );
};

export default ExamDetail;
