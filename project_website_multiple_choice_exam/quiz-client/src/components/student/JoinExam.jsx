import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinExam = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "student") {
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/dethi", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const realExams = response.data.filter((exam) => exam.trangthai === "dethi");
        setExams(realExams);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError("Không thể tải danh sách đề thi.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [navigate]);

  const handleJoin = (exam) => {
    const now = new Date();
    const start = new Date(exam.thoigianbatdau);
    const end = new Date(exam.thoigianketthuc);

    if (now < start || now > end) {
      setError(`Đề thi ${exam.tendethi} đã hết hạn hoặc chưa bắt đầu.`);
      return;
    }

    // In a real app, the code should be validated against a field in the dethi table
    if (code !== "exam123") { // Example code; replace with actual validation
      setError("Mã đề thi không đúng.");
      return;
    }

    navigate(`/join-exam/take/${exam.id_dethi}`);
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Tham Gia Thi</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nhập mã đề thi"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        />
      </div>
      {exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div key={exam.id_dethi} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{exam.tendethi}</h2>
              <p>
                <strong>Môn:</strong> {exam.id_monhoc}
              </p>
              <p>
                <strong>Thời gian bắt đầu:</strong>{" "}
                {new Date(exam.thoigianbatdau).toLocaleString("vi-VN")}
              </p>
              <p>
                <strong>Thời gian kết thúc:</strong>{" "}
                {new Date(exam.thoigianketthuc).toLocaleString("vi-VN")}
              </p>
              <p>
                <strong>Thời gian làm bài:</strong> {exam.thoigianthi} phút
              </p>
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleJoin(exam)}
              >
                Tham Gia Thi
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Không có đề thi nào.</p>
      )}
    </div>
  );
};

export default JoinExam;