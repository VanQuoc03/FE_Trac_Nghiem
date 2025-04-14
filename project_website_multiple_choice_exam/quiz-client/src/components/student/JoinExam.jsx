import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinExam = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
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

        console.log("Backend exams response:", response.data);

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
    setError(""); // Reset lỗi

    // Thời gian hiện tại (múi giờ cục bộ)
    const now = new Date();
    console.log("Current time (local):", now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));

    // Parse thời gian từ backend (giả sử là YYYY-MM-DD HH:mm:ss cục bộ)
    const start = new Date(exam.thoigianbatdau);
    const end = new Date(exam.thoigianketthuc);

    console.log("Exam data:", exam);
    console.log("Exam start time:", exam.thoigianbatdau, start.toLocaleString("vi-VN"));
    console.log("Exam end time:", exam.thoigianketthuc, end.toLocaleString("vi-VN"));

    // Kiểm tra tính hợp lệ của thời gian
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError(`Thời gian của đề thi ${exam.tendethi} không hợp lệ.`);
      console.log("Invalid date detected:", { start, end });
      return;
    }

    // So sánh thời gian
    if (now < start) {
      setError(`Đề thi ${exam.tendethi} chưa bắt đầu. Bắt đầu lúc ${start.toLocaleString("vi-VN")}.`);
      console.log("Exam not started:", { now, start });
      return;
    }
    if (now > end) {
      setError(`Đề thi ${exam.tendethi} đã hết hạn. Kết thúc lúc ${end.toLocaleString("vi-VN")}.`);
      console.log("Exam ended:", { now, end });
      return;
    }

    console.log(`Joining exam ${exam.id_dethi}`);
    navigate(`/join-exam/take/${exam.id_dethi}`);
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center">Lựa Chọn Đề Thi</h1>
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
                {new Date(exam.thoigianbatdau).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </p>
              <p>
                <strong>Thời gian kết thúc:</strong>{" "}
                {new Date(exam.thoigianketthuc).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
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