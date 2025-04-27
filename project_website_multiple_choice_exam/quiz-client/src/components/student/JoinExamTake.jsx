import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID

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

  // Hàm giải mã token để lấy id_hocsinh
  const getIdHocSinhFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id_hocsinh;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  // Hàm chuẩn hóa đáp án đúng
  const normalizeDapan = (dapan) => {
    if (!dapan) return "";
    if (dapan.startsWith("Dapan ")) {
      return dapan.replace("Dapan ", "").trim();
    }
    return dapan.trim();
  };

  // Hàm lấy nội dung đáp án từ options dựa trên ký tự (A, B, C, D)
  const getAnswerContent = (answer, options) => {
    if (!answer || !options || options.length === 0) return "Không xác định";
    const index = ["A", "B", "C", "D"].indexOf(answer);
    return index >= 0 && index < options.length ? options[index] : answer;
  };

  // Lấy thông tin đề thi và câu hỏi
  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "student" || !user.token) {
          setError("Vui lòng đăng nhập với tài khoản học sinh.");
          navigate("/login");
          return;
        }

        const examResponse = await axios.get(`/api/dethi/${id_dethi}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const examData = examResponse.data;
        if (examData.trangthai !== "dethi") {
          setError("Đây không phải đề thi thật.");
          setLoading(false);
          return;
        }

        const now = new Date();
        const start = new Date(examData.thoigianbatdau);
        const end = new Date(examData.thoigianketthuc);

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

        const normalizedQuestions = (examData.questions || []).map((question) => ({
          ...question,
          dapan: normalizeDapan(question.dapan),
        }));

        setExam(examData);
        setTimeLeft(examData.thoigianthi * 60);
        setQuestions(normalizedQuestions);
      } catch (err) {
        console.error("Error fetching exam:", err);
        if (err.response?.status === 404) {
          setError(`Không tìm thấy đề thi với mã ${id_dethi}.`);
        } else if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          setError("Không thể tải bài thi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExamAndQuestions();
  }, [id_dethi, navigate]);

  // Quản lý thời gian
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

  // Phát hiện vi phạm
  useEffect(() => {
    // Không cần xử lý vi phạm nếu bài thi đã nộp và có điểm
    if (score !== null) return;

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
  }, [score]);

  // Xử lý vi phạm
  const handleViolation = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const id_hocsinh = getIdHocSinhFromToken(user.token);
      if (!id_hocsinh) {
        setError("Không thể xác định học sinh. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }

      const id_baithi = `BT${uuidv4()}`; // Generate UUID-based id_baithi
      await axios.post(
        "/api/baithi",
        {
          id_baithi,
          id_hocsinh,
          id_dethi,
          ngaylam: new Date().toISOString(),
          trangthai: "hoanthanh",
          diemthi: 0,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setScore(0);
    } catch (err) {
      console.error("Error saving violation score:", err);
      setError("Không thể lưu điểm vi phạm.");
    }
  };

  // Lưu đáp án của học sinh
  const handleAnswerChange = (questionId, answer, options) => {
    setAnswers((prev) => {
      const answerContent = getAnswerContent(answer, options);
      const newAnswers = { ...prev, [questionId]: answerContent };
      return newAnswers;
    });
  };

  // Nộp bài và tính điểm
  const handleSubmit = async () => {
    if (violation) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      setError("Không thể xác định học sinh. Vui lòng đăng nhập lại.");
      navigate("/login");
      return;
    }

    const id_hocsinh = getIdHocSinhFromToken(user.token);
    if (!id_hocsinh) {
      setError("Không thể xác định học sinh. Vui lòng đăng nhập lại.");
      navigate("/login");
      return;
    }

    try {
      let correctCount = 0;
      const totalQuestions = questions.length;

      questions.forEach((question) => {
        const selectedAnswer = answers[question.id_cauhoi] || "Chưa chọn";
        const correctAnswer = ["A", "B", "C", "D"].includes(question.dapan)
          ? getAnswerContent(question.dapan, question.options)
          : question.dapan;
        const isCorrect = selectedAnswer === correctAnswer;
        if (isCorrect) {
          correctCount++;
        }
      });

      const calculatedScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;
      setScore(calculatedScore);

      const id_baithi = `BT${uuidv4()}`;
      const payload = {
        id_baithi,
        id_hocsinh,
        id_dethi,
        ngaylam: new Date().toISOString(),
        trangthai: "hoanthanh",
        diemthi: calculatedScore,
      };

      await axios.post("/api/baithi", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (err) {
      console.error("Error submitting exam:", err);
    }
  };

  // Giao diện hiển thị
  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  if (violation) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold text-red-500">Vi phạm quy chế thi</h2>
        <p className="mt-4">Bạn đã chuyển tab hoặc thực hiện hành vi không được phép.</p>
        <p className="mt-2">
          <strong>Điểm số:</strong> 0/10
        </p>
        <button
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/history-exam")}
        >
          Về Trang Chủ
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto pt-24">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{exam?.tendethi || "N/A"}</h2>
            <p>
              <strong>Môn học:</strong> {exam?.tenmonhoc || "N/A"}
            </p>
            <p>
              <strong>Giáo viên:</strong> {exam?.ten_giaovien || "N/A"}
            </p>
            <p>
              <strong>Mã học sinh:</strong>{" "}
              {getIdHocSinhFromToken(JSON.parse(localStorage.getItem("user"))?.token) || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      {score !== null ? (
        <div className="text-center bg-green-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Kết quả bài thi</h2>
          <p className="text-lg">
            <strong>Điểm số:</strong> {score.toFixed(1)}/10
          </p>
          <button
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/history-exam")}
          >
            Về Trang Chủ
          </button>
        </div>
      ) : (
        <div>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id_cauhoi} className="bg-white shadow-md rounded-lg p-4 mb-4">
                <p className="font-semibold text-lg">
                  Câu {index + 1}: {question.noidungcauhoi}
                </p>
                <div className="mt-4">
                  {question.options && question.options.length > 0 ? (
                    question.options.map((option, idx) => (
                      <label key={idx} className="block mb-2 flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id_cauhoi}`}
                          value={String.fromCharCode(65 + idx)} // A, B, C, D
                          checked={answers[question.id_cauhoi] === getAnswerContent(String.fromCharCode(65 + idx), question.options)}
                          onChange={() =>
                            handleAnswerChange(question.id_cauhoi, String.fromCharCode(65 + idx), question.options)
                          }
                          className="mr-2 h-5 w-5"
                        />
                        <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {option}
                      </label>
                    ))
                  ) : (
                    <p className="text-red-500">Không có đáp án cho câu hỏi này.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Không có câu hỏi nào cho đề thi này.</p>
          )}
          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Nộp Bài
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinExamTake;