import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PracticePage = () => {
  const navigate = useNavigate();
  const [practiceExams, setPracticeExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPracticeExams = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "student") {
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/dethi", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        const exams = response.data.filter((exam) => exam.trangthai === "onthi");
        setPracticeExams(exams);
      } catch (err) {
        console.error("Error fetching practice exams:", err);
        setError("Không thể tải danh sách bài ôn tập.");
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeExams();
  }, [navigate]);

  if (loading) {
    return <div className="text-center p-6">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Danh Sách Bài Ôn Tập</h1>
      {practiceExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {practiceExams.map((exam) => (
            <div
              key={exam.id_dethi}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/practice/take/${exam.id_dethi}`)}
            >
              <h2 className="text-lg font-semibold">{exam.tendethi}</h2>
              <p>
                <strong>Môn:</strong> {exam.id_monhoc}
              </p>
              <p>
                <strong>Thời gian làm bài:</strong> {exam.thoigianthi} phút
              </p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Làm bài
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Không có bài ôn tập nào.</p>
      )}
    </div>
  );
};

export default PracticePage;