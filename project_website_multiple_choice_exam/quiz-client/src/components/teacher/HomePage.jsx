import React, { useEffect, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BAITHI = "/api/baithi";

const ExamCard = ({ id, title, startTime, endTime, duration, score, date, button, teacherId }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#f5f5f5] to-[#ffffff] rounded-xl shadow-lg w-[250px] h-[100%] box border m-2 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <h3 className="font-bold text-xl p-3 text-[#333333]">{title}</h3>
      <div>
        {startTime && endTime && duration && (
          <>
            <p className="p-2 flex text-[#666666]">
              <CiClock2 className="m-1 text-[#C7A36F]" /> <strong>{duration}</strong>
            </p>
            <p className="p-2 text-[#555555]">
              Thời gian bắt đầu: <strong>{startTime}</strong>
            </p>
            <p className="p-2 text-[#555555]">
              Thời gian kết thúc: <strong>{endTime}</strong>
            </p>
          </>
        )}
        {date && (
          <p className="p-2 text-[#444444]">
            Ngày thi: <strong>{new Date(date).toLocaleString("vi-VN")}</strong>
          </p>
        )}
        {score !== undefined && (
          <p className="p-2 text-[#444444]">
            Điểm: <strong>{score}</strong>
          </p>
        )}
      </div>
      <div className="flex justify-center mb-3">
        {button && (
          <button
            className="mt-3 bg-[#C7A36F] px-4 py-2 rounded-lg hover:bg-[#9c7a4e] text-white w-[90%] border-2 border-solid"
            onClick={() =>
              navigate(`/teacher/exam/${id}`, { state: { teacherId } })
            }
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
  const [user, setUser] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    let storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    if (storedUser.role !== "teacher") {
      navigate("/login");
      return;
    }
    if (!storedUser.token) {
      navigate("/login");
      return;
    }

    let extractedTeacherId = storedUser.id;
    if (!extractedTeacherId) {
      try {
        const tokenPayload = JSON.parse(atob(storedUser.token.split(".")[1]));
        extractedTeacherId = tokenPayload.id_giaovien;
        storedUser.id = extractedTeacherId;
        localStorage.setItem("user", JSON.stringify(storedUser));
      } catch (error) {
        navigate("/login");
        return;
      }
    }

    setUser(storedUser);
    setTeacherId(extractedTeacherId);

    const fetchData = async () => {
      try {
        const response = await axios.get(API_BAITHI, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        if (!Array.isArray(data)) {
          throw new Error("API không trả về mảng!");
        }

        const teacherExams = data.filter(
          (exam) => exam.dethi.id_giaovien === extractedTeacherId
        );

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

        const completed = teacherExams.filter((exam) => exam.trangthai === "hoanthanh");
        completed.sort((a, b) => new Date(b.ngaylam) - new Date(a.ngaylam));

        setExams(examsToday);
        setCompletedExams(completed);
        setLatestExam(completed[0] || null);
      } catch (error) {
        setError(error.message || "Không thể tải bài thi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center text-xl font-bold mt-10">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen p-5 w-[100%] mt-24">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="font-bold text-2xl mb-4">Lịch thi hôm nay</h2>
        <div className="flex flex-wrap w-full gap-4 justify-start">
          {exams.length > 0 ? (
            exams.map((exam) => (
              <ExamCard key={exam.id} {...exam} teacherId={teacherId} button="Làm bài" />
            ))
          ) : (
            <p className="text-[#777]">Không có bài thi nào hôm nay.</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-8">Các bài đã thi</h2>
        <div className="flex flex-wrap gap-4 justify-start">
          {completedExams.length > 0 ? (
            completedExams.map((exam) => (
              <ExamCard
                key={exam.id_baithi}
                id={exam.id_baithi}
                title={`Bài thi ${exam.dethi.tendethi}`}
                date={exam.ngaylam}
                score={exam.diemthi}
                teacherId={teacherId}
              />
            ))
          ) : (
            <p className="text-[#777]">Chưa có bài thi nào được hoàn thành.</p>
          )}
        </div>

        {latestExam && (
          <>
            <h2 className="text-2xl font-bold mb-4 mt-8">Bài thi mới nhất</h2>
            <div>
              <ExamCard
                id={latestExam.id_baithi}
                title={`Bài thi ${latestExam.dethi.tendethi}`}
                date={latestExam.ngaylam}
                score={latestExam.diemthi}
                teacherId={teacherId}
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
