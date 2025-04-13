import React, { useEffect, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BAITHI = "/api/baithi";

const ExamCard = ({ id, title, startTime, endTime, duration, score, date, button }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md w-[250px] h-[100%] box border m-2">
      <h3 className="font-bold p-2">{title}</h3>
      <div>
        {startTime && endTime && duration && (
          <>
            <p className="p-2 flex">
              <CiClock2 className="m-1" /> <strong>{duration}</strong>
            </p>
            <p className="p-2">
              Thời gian bắt đầu: <strong>{startTime}</strong>
            </p>
            <p className="p-2">
              Thời gian kết thúc: <strong>{endTime}</strong>
            </p>
          </>
        )}
        {date && (
          <p className="p-2">
            Ngày thi: <strong>{new Date(date).toLocaleString("vi-VN")}</strong>
          </p>
        )}
        {score !== undefined && (
          <p className="p-2">
            Điểm: <strong>{score}</strong>
          </p>
        )}
      </div>
      <div className="flex justify-center mb-3">
        {button && (
          <button
            className="mt-3 bg-white px-4 py-2 rounded-lg hover:bg-slate-300 w-[90%] text-black border-2 border-solid"
            onClick={() => navigate(`/exam/${id}`)}
          >
            {button}
          </button>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [latestExam, setLatestExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const giaovien = JSON.parse(localStorage.getItem("giaovien"));
    if (!giaovien) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9naWFvdmllbiI6IkdWMDAyIiwidGVuZGFuZ25oYXBfZ3YiOiJnaWFvdmllbjIiLCJpYXQiOjE3NDQ1Mzc5NjksImV4cCI6MTc0NDU0MTU2OX0.egecp73tdg7p68zPQN5SQX0CGa4_ABqA3nTT9t6LKuQ";

        const response = await axios.get(API_BAITHI, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        if (!Array.isArray(data)) {
          throw new Error("API không trả về mảng!");
        }

        // Lọc bài thi của giáo viên hiện tại (dựa trên id_giaovien trong dethi)
        const teacherExams = data.filter(
          (exam) => exam.dethi.id_giaovien === giaovien.id_giaovien
        );

        // Lọc bài thi hôm nay (danglam hoặc chưa bắt đầu)
        const today = new Date().toISOString().split("T")[0];
        const examsToday = teacherExams
          .filter(
            (exam) =>
              (exam.trangthai === "danglam" || exam.trangthai === "") &&
              new Date(exam.dethi.thoigianbatdau).toISOString().split("T")[0] === today
          )
          .map((exam) => ({
            id: exam.id_baithi,
            title: `Bài thi ${exam.dethi.tendethi}`,
            startTime: new Date(exam.dethi.thoigianbatdau).toLocaleTimeString("vi-VN"),
            endTime: new Date(exam.dethi.thoigianketthuc).toLocaleTimeString("vi-VN"),
            duration: `${exam.dethi.thoigianthi} phút`,
          }));

        // Lọc bài thi đã hoàn thành
        const completed = teacherExams.filter((exam) => exam.trangthai === "hoanthanh");
        completed.sort((a, b) => new Date(b.ngaylam) - new Date(a.ngaylam));

        setExams(examsToday);
        setCompletedExams(completed);
        setLatestExam(completed[0] || null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        setError(error.response?.data?.message || "Không thể tải bài thi");
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("giaovien");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center text-xl font-bold mt-10">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-5 w-[100%]">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="font-bold text-2xl mb-4">Lịch thi hôm nay</h2>
        <div className="flex flex-wrap w-full gap-4 justify-start">
          {exams.length > 0 ? (
            exams.map((exam) => (
              <ExamCard key={exam.id} {...exam} button="Làm bài" />
            ))
          ) : (
            <p>Không có bài thi nào hôm nay.</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4">Các bài đã thi</h2>
        <div className="flex flex-wrap gap-4 justify-start">
          {completedExams.length > 0 ? (
            completedExams.map((exam) => (
              <ExamCard
                key={exam.id_baithi}
                id={exam.id_baithi}
                title={`Bài thi ${exam.dethi.tendethi}`}
                date={exam.ngaylam}
                score={exam.diemthi}
              />
            ))
          ) : (
            <p>Chưa có bài thi nào được hoàn thành.</p>
          )}
        </div>

        {latestExam && (
          <>
            <h2 className="text-2xl font-bold mb-4">Bài thi mới nhất</h2>
            <div>
              <ExamCard
                id={latestExam.id_baithi}
                title={`Bài thi ${latestExam.dethi.tendethi}`}
                date={latestExam.ngaylam}
                score={latestExam.diemthi}
                button="Chi tiết"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;