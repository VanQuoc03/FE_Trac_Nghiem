import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PracticeTake = () => {
  const { id_dethi } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);

  // Hàm giải mã token để lấy id_hocsinh
  const getIdHocSinhFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", payload); // Debug
      return payload.id_hocsinh || payload.id; // Fallback to id if id_hocsinh is not present
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

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        console.log("Fetching exam for id_dethi:", id_dethi);
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User from localStorage:", JSON.stringify(user, null, 2));
        if (!user || user.role !== "student") {
          console.log("User not logged in or not a student, redirecting to login");
          setError("Vui lòng đăng nhập với tư cách học sinh.");
          setTimeout(() => navigate("/login"), 1000);
          return;
        }

        console.log("Making API request to /api/dethi/", id_dethi);
        const examResponse = await axios.get(`https://quiz-api-34vp.onrender.com/api/dethi/${id_dethi}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const examData = examResponse.data;
        console.log("Exam Data received:", JSON.stringify(examData, null, 2));

        if (!examData || !examData.id_dethi) {
          throw new Error("Dữ liệu đề thi không hợp lệ.");
        }

        if (examData.trangthai !== "onthi") {
          console.log("Exam status is not 'onthi', setting error");
          setError("Đây không phải bài ôn tập. Vui lòng chọn bài ôn tập khác.");
          setLoading(false);
          return;
        }

        const normalizedQuestions = (examData.questions || []).map((question) => ({
          ...question,
          dapan: normalizeDapan(question.dapan),
        }));

        setExam(examData);
        setTimeLeft(examData.thoigianthi * 60 || 0);
        setQuestions(normalizedQuestions);
      } catch (err) {
        console.error("Error fetching exam:", err);
        if (err.response?.status === 404) {
          setError(`Không tìm thấy bài ôn tập với mã ${id_dethi}.`);
        } else if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          setError("Không thể tải bài ôn tập.");
        }
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchExamAndQuestions();
  }, [id_dethi, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 || score !== null) return;

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
  }, [timeLeft, score]);

  const handleAnswerChange = (questionId, answer, options) => {
    setAnswers((prev) => {
      const answerContent = getAnswerContent(answer, options);
      const newAnswers = { ...prev, [questionId]: answerContent };
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        setError("Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      const id_hocsinh = getIdHocSinhFromToken(user.token);
      if (!id_hocsinh) {
        setError("Không thể xác định mã học sinh. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      let correctCount = 0;
      const totalQuestions = questions.length;

      if (totalQuestions === 0) {
        setError("Bài ôn tập không có câu hỏi.");
        return;
      }

      questions.forEach((question) => {
        const selectedAnswer = answers[question.id_cauhoi] || "Chưa chọn";
        const correctAnswer = ["A", "B", "C", "D"].includes(question.dapan)
          ? getAnswerContent(question.dapan, question.options)
          : question.dapan;
        console.log(
          `Question ${question.id_cauhoi}: Selected = ${selectedAnswer}, Correct = ${correctAnswer}`
        );
        const isCorrect = selectedAnswer === correctAnswer;
        if (isCorrect) {
          correctCount++;
        }
      });

      const calculatedScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;
      setScore(calculatedScore);

      const id_baithi = `BT${uuidv4().slice(0, 8)}`;
      const payload = {
        id_baithi,
        id_hocsinh,
        id_dethi,
        ngaylam: new Date().toISOString(),
        trangthai: "hoanthanh",
        diemthi: calculatedScore,
      };

      console.log("Submitting exam result:", payload);
      const response = await axios.post("https://quiz-api-34vp.onrender.com/api/baithi", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("Exam submitted successfully:", response.data);
    } catch (err) {
      console.error("Error submitting exam:", err);
      const errorMessage = err.response?.data?.message || "Không thể nộp bài. Vui lòng thử lại.";
      setError(errorMessage);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "1.5rem" }}>Đang tải...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "red" }}>
        {error}
        <br />
        <button
          style={{
            marginTop: "1rem",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Về Trang Chủ
        </button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "red" }}>
        Không tìm thấy bài ôn tập.
        <br />
        <button
          style={{
            marginTop: "1rem",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
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
          <h2 className="text-2xl font-semibold mb-4">Kết quả bài ôn tập</h2>
          <p className="text-lg">
            <strong>Điểm số:</strong> {score.toFixed(1)}/10
          </p>
          <button
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/")}
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
                          value={String.fromCharCode(65 + idx)}
                          checked={
                            answers[question.id_cauhoi] ===
                            getAnswerContent(String.fromCharCode(65 + idx), question.options)
                          }
                          onChange={() =>
                            handleAnswerChange(
                              question.id_cauhoi,
                              String.fromCharCode(65 + idx),
                              question.options
                            )
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
            <p className="text-center text-gray-600">Không có câu hỏi nào cho bài ôn tập này.</p>
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

export default PracticeTake;
