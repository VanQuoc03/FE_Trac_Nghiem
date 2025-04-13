import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "student") {
          navigate("/login");
          return;
        }

        // Fetch exam details
        const examResponse = await axios.get(`/api/dethi/${id_dethi}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const examData = examResponse.data;
        if (examData.trangthai !== "onthi") {
          setError("Đây không phải bài ôn tập.");
          setLoading(false);
          return;
        }
        setExam(examData);
        setTimeLeft(examData.thoigianthi * 60); // Convert minutes to seconds

        // Fetch questions (assuming dethi_cauhoi and cauhoi tables are populated)
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

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let correctCount = 0;
      const totalQuestions = questions.length;

      // Compare answers
      questions.forEach((question) => {
        if (answers[question.id_cauhoi] === question.dapan) {
          correctCount++;
        }
      });

      const calculatedScore = (correctCount / totalQuestions) * 10; // Score out of 10
      setScore(calculatedScore);

      // Save to baithi table
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{exam.tendethi}</h1>
      <div className="flex justify-between mb-4">
        <p>
          <strong>Thời gian còn lại:</strong> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </p>
        <p>
          <strong>Học sinh:</strong> {JSON.parse(localStorage.getItem("user")).id}
        </p>
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
                <label key={option} className="block mt-2">
                  <input
                    type="radio"
                    name={`question-${question.id_cauhoi}`}
                    value={option}
                    onChange={() => handleAnswerChange(question.id_cauhoi, option)}
                    className="mr-2"
                  />
                  {option}: {question[`dapan_${option.toLowerCase()}`] || "N/A"}
                </label>
              ))}
            </div>
          ))}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Nộp Bài
          </button>
        </>
      )}
    </div>
  );
};

export default PracticeTake;