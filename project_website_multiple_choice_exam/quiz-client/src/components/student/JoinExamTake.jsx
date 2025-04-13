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
        if (!user || user.role !== "student") {
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
        if (now < start || now > end) {
          setError("Đề thi đã hết hạn hoặc chưa bắt đầu.");
          setLoading(false);
          return;
        }

        setExam(examData);
        setTimeLeft(examData.thoigianthi * 60);

        const questionsResponse = await axios.get(`/api/dethi/${id_dethi}/questions`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setQuestions(questionsResponse.data);
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("Không thể tải bài thi.");
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
          ngaylam: new Date().toISOString(),
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

      const calculatedScore = (correctCount / totalQuestions) * 10;
      setScore(calculatedScore);

      await axios.post(
        "/api/baithi",
        {
          id_hocsinh: user.id,
          id_dethi: id_dethi,
          ngaylam: new Date().toISOString(),
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
            <strong>Họ và tên:</strong> {JSON.parse(localStorage.getItem("user")).id}
          </p>
          <p>
            <strong>Bài thi:</strong> {exam.tendethi}
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
          {questions.map((question, index) => (
            <div key={question.id_cauhoi} className="mb-6">
              <p className="font-semibold">
                Câu hỏi {index + 1}: {question.noidungcauhoi}
              </p>
              {["A", "B", "C", "D"].map((option) => (
                <label key={option} className="block mt-2 flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id_cauhoi}`}
                    value={option}
                    onChange={() => handleAnswerChange(question.id_cauhoi, option)}
                    className="mr-2"
                  />
                  <span className="mr-2">{option}</span>
                  {question[`dapan_${option.toLowerCase()}`] || "N/A"}
                </label>
              ))}
            </div>
          ))}
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