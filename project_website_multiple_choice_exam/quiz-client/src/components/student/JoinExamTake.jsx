import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JoinExamTake = () => {
  const { id_dethi } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);
  const [violation, setViolation] = useState(false);

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User data:", user);
        if (!user || user.role !== "student") {
          console.log("Invalid user or role, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Fetching exam for id_dethi:", id_dethi);
        const examResponse = await axios.get(`/api/dethi/dethi/${id_dethi}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("Exam response:", examResponse.data);

        const examData = examResponse.data;
        if (examData.trangthai !== "dethi") {
          setError("Đây không phải đề thi thật.");
          setLoading(false);
          return;
        }

        // Thời gian hiện tại và thời gian đề thi (múi giờ cục bộ)
        const now = new Date();
        const start = new Date(examData.thoigianbatdau);
        const end = new Date(examData.thoigianketthuc);

        console.log("Current time:", now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
        console.log("Exam start:", examData.thoigianbatdau, start.toLocaleString("vi-VN"));
        console.log("Exam end:", examData.thoigianketthuc, end.toLocaleString("vi-VN"));

        // Kiểm tra thời gian hợp lệ
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          setError("Thời gian đề thi không hợp lệ.");
          setLoading(false);
          return;
        }

        if (now < start) {
          setError(`Đề thi chưa bắt đầu. Bắt đầu lúc ${start.toLocaleString("vi-VN")}.`);
          setLoading(false);
          return;
        }
        if (now > end) {
          setError(`Đề thi đã hết hạn. Kết thúc lúc ${end.toLocaleString("vi-VN")}.`);
          setLoading(false);
          return;
        }

        setExam(examData);
        setTimeLeft(examData.thoigianthi * 60);
        setQuestions(examData.questions || []); // Route mới trả questions trực tiếp
      } catch (err) {
        console.error("Error fetching exam:", err);
        if (err.response?.status === 404) {
          setError(`Không tìm thấy đề thi với mã ${id_dethi}. Vui lòng kiểm tra lại mã đề thi hoặc liên hệ giáo viên.`);
        } else if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              `Không thể tải bài thi. Lỗi: ${err.message}`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExamAndQuestions();
  }, [id_dethi, navigate]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || score !== null || violation) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score, violation]);

  // Restrictions
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolation(true);
        handleViolation();
      }
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey && (e.key === "c" || e.key === "v")) || e.key === "F12") {
        e.preventDefault();
        setViolation(true);
        handleViolation();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      setViolation(true);
      handleViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleViolation = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        "/api/baithi",
        {
          id_hocsinh: user.id,
          id_dethi: id_dethi,
          ngaylam: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
          trangthai: "hoanthanh",
          diemthi: 0,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setScore(0);
    } catch (err) {
      console.error("Error saving violation score:", err);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (violation) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let correctCount = 0;
      const totalQuestions = questions.length;

      questions.forEach((question) => {
        if (answers[question.id_cauhoi] === question.dapan) {
          correctCount++;
        }
      });

      const calculatedScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;
      setScore(calculatedScore);

      await axios.post(
        "/api/baithi",
        {
          id_hocsinh: user.id,
          id_dethi: id_dethi,
          ngaylam: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
          trangthai: "hoanthanh",
          diemthi: calculatedScore,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError("Không thể nộp bài.");
    }
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  if (violation) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold text-red-500">
          Bạn đã vi phạm quy chế thi (chuyển tab, copy-paste, hoặc mở widget).
        </h2>
        <p className="mt-2">
          <strong>Điểm số:</strong> 0/10
        </p>
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <div>
          <p>
            <strong>Họ và tên:</strong> {JSON.parse(localStorage.getItem("user"))?.id || "N/A"}
          </p>
          <p>
            <strong>Bài thi:</strong> {exam?.tendethi || "N/A"}
          </p>
          <p>
            <strong>Môn học:</strong> {exam?.tenmonhoc || "N/A"}
          </p>
          <p>
            <strong>Giáo viên:</strong> {exam?.ten_giaovien || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p>
            <strong>Thời gian còn lại:</strong>{" "}
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      {score !== null ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Kết quả</h2>
          <p>
            <strong>Điểm số:</strong> {score.toFixed(1)}/10
          </p>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Về Trang Chủ
          </button>
        </div>
      ) : (
        <>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id_cauhoi} className="mb-6">
                <p className="font-semibold">
                  Câu hỏi {index + 1}: {question.noidungcauhoi}
                </p>
                {question.options && question.options.length > 0 ? (
                  question.options.map((option, idx) => (
                    <label key={idx} className="block mt-2 flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id_cauhoi}`}
                        value={String.fromCharCode(65 + idx)} // A, B, C, D
                        onChange={() => handleAnswerChange(question.id_cauhoi, String.fromCharCode(65 + idx))}
                        className="mr-2"
                      />
                      <span className="mr-2">{String.fromCharCode(65 + idx)}</span>
                      {option}
                    </label>
                  ))
                ) : (
                  <p className="text-red-500">Không có đáp án cho câu hỏi này.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center">Không có câu hỏi nào cho đề thi này.</p>
          )}
          <div className="flex justify-between">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => navigate("/")}
            >
              Về Trang Chủ
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Nộp Bài
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JoinExamTake;