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
        console.log("User from localStorage:", JSON.stringify(user, null, 2));
        if (!user || user.role !== "student") {
          setError("Vui lòng đăng nhập với tư cách học sinh.");
          setTimeout(() => navigate("/login"), 1000);
          return;
        }

        const tokenPayload = JSON.parse(atob(user.token.split(".")[1]));
        console.log("Token payload:", JSON.stringify(tokenPayload, null, 2));

        const response = await axios.get(`/api/dethi?trangthai=dethi&t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        console.log("Backend exams response:", JSON.stringify(response.data, null, 2));
        const validExams = response.data.filter(exam => {
          const end = new Date(exam.thoigianketthuc);
          return end > new Date();
        });
        setExams(validExams);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError(err.response?.data?.message || "Không thể tải danh sách đề thi.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [navigate]);

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.thoigianbatdau);
    const end = new Date(exam.thoigianketthuc);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { status: "invalid", text: "Thời gian không hợp lệ", disabled: true };
    }
    if (now < start) {
      return { status: "not-started", text: "Chưa xảy ra", disabled: true };
    }
    if (now > end) {
      return { status: "ended", text: "Đã hết hạn", disabled: true };
    }
    return { status: "ongoing", text: "Đang diễn ra", disabled: false };
  };

  const handleJoin = (exam) => {
    setError("");

    const now = new Date();
    console.log("Current time (local):", now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));

    const start = new Date(exam.thoigianbatdau);
    const end = new Date(exam.thoigianketthuc);

    console.log("Exam data:", JSON.stringify(exam, null, 2));
    console.log("Exam start time:", exam.thoigianbatdau, start.toLocaleString("vi-VN"));
    console.log("Exam end time:", exam.thoigianketthuc, end.toLocaleString("vi-VN"));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError(`Thời gian của đề thi ${exam.tendethi} không hợp lệ.`);
      console.log("Invalid date detected:", { start, end });
      return;
    }

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

  if (loading) {
    return <div className="text-center p-6">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        {error}
        <br />
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Về Trang Chủ
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center">Lựa Chọn Đề Thi</h1>
      {exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exams.map((exam) => {
            const { status, text, disabled } = getExamStatus(exam);
            return (
              <div key={exam.id_dethi} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">{exam.tendethi || "Không có tiêu đề"}</h2>
                <p>
                  <strong>Môn:</strong> {exam.monhoc?.tenmonhoc || exam.monhoc?.id_monhoc || "Không xác định"}
                </p>
                <p>
                  <strong>Giáo viên:</strong> {exam.giaovien?.ten_giaovien || "Không xác định"}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={
                      status === "ongoing"
                        ? "text-green-600"
                        : status === "not-started"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {text}
                  </span>
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
                  className={`mt-2 px-4 py-2 rounded text-white ${
                    disabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => handleJoin(exam)}
                  disabled={disabled}
                >
                  Tham Gia Thi
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center">Không có đề thi nào.</p>
      )}
    </div>
  );
};

export default JoinExam;