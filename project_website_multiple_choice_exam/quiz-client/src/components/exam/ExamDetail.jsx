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

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) return;

    try {
      await axios.delete(`/api/dethi/${id_dethi}`);
      alert("Xóa đề thi thành công!");
      navigate("/teacher/exams");
    } catch (error) {
      console.log("Lỗi khi xóa đề thi", error);
      alert("Xóa đề thi thất bại!");
    }
  };

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
        {exam.tenmonhoc}
      </p>
      <p>
        <strong>Thời gian thi: </strong>
        {exam.thoigianthi} phút
      </p>
      <p>
        <strong>Trạng thái: </strong>
        {exam.trangthai}
      </p>
      <p>
        <strong>Giáo viên: </strong>
        {exam.ten_giaovien}
      </p>

      <h3 className="text-xl font-bold mt-6 mb-4">Danh sách câu hỏi</h3>
      {exam.questions && exam.questions.length > 0 ? (
        exam.questions.map((question, index) => (
          <div key={question.id_cauhoi} className="border p-4 mb-4 rounded">
            <p>
              <strong>Câu hỏi {index + 1}: </strong>
              {question.noidungcauhoi}
            </p>
            <p>
              <strong>Đáp án đúng: </strong>
              {question.dapan}
            </p>
            <p>
              <strong>Các lựa chọn: </strong>
            </p>
            <ul className="list-disc ml-6">
              {question.options.map((option, oIndex) => (
                <li key={oIndex}>
                  {String.fromCharCode(65 + oIndex)}. {option}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Không có câu hỏi nào cho đề thi này.</p>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
          onClick={() => navigate(`/dethi/edit/${exam.id_dethi}`)}
        >
          Sửa
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default ExamDetail;