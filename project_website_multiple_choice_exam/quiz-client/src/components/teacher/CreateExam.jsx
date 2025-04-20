import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateExam = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(10);
  const [numQuestions, setNumQuestions] = useState(5);
  const [startTime, setStartTime] = useState("");
  const [examType, setExamType] = useState("dethi");
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "teacher") {
      navigate("/login");
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/monhoc", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSubjects(response.data);
        if (response.data.length > 0) {
          setSubject(response.data[0].id_monhoc);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách môn học:", error);
        setError(error.response?.data?.message || "Không thể tải danh sách môn học");
      }
    };

    fetchSubjects();
  }, [navigate]);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));
    const now = new Date();
    const pad2 = (n) => String(n).padStart(2, "0");
    const ngay_tao = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(
      now.getDate()
    )} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;

    const localStartTime = new Date(startTime);
    if (isNaN(localStartTime.getTime())) {
      setError("Thời gian bắt đầu không hợp lệ!");
      setLoading(false);
      return;
    }

    const pad = (num) => String(num).padStart(2, "0");
    const thoigianbatdau = `${localStartTime.getFullYear()}-${pad(
      localStartTime.getMonth() + 1
    )}-${pad(localStartTime.getDate())} ${pad(localStartTime.getHours())}:${pad(
      localStartTime.getMinutes()
    )}:${pad(localStartTime.getSeconds())}`;

    const localEndTime = new Date(localStartTime.getTime() + duration * 60000);
    const thoigianketthuc = `${localEndTime.getFullYear()}-${pad(
      localEndTime.getMonth() + 1
    )}-${pad(localEndTime.getDate())} ${pad(localEndTime.getHours())}:${pad(
      localEndTime.getMinutes()
    )}:${pad(localEndTime.getSeconds())}`;

    const examData = {
      id_giaovien: user.id,
      id_monhoc: subject,
      tendethi: title,
      thoigianthi: duration,
      trangthai: examType,
      thoigianbatdau,
      thoigianketthuc,
      ngay_tao,
      is_restricted: 0, // Default to unrestricted
      allowed_students: [],
    };

    try {
      console.log("Sending examData:", examData);
      const response = await axios.post("/api/exams", examData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Tạo bài thi thành công!");
      navigate("/teacher/form-question", {
        state: {
          numQuestions,
          examData: { ...examData, id_dethi: response.data.exam.id_dethi },
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo bài thi:", error);
      setError(error.response?.data?.message || "Lỗi khi tạo bài thi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-md w-[90%] mx-auto mt-10">
      <h2 className="text-4xl flex justify-center m-5 font-medium">
        Tạo bài thi
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form
        onSubmit={handleCreateExam}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium" htmlFor="title">
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="subject">
            Môn học
          </label>
          <select
            id="subject"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={subjects.length === 0}
          >
            {subjects.length > 0 ? (
              subjects.map((sub) => (
                <option key={sub.id_monhoc} value={sub.id_monhoc}>
                  {sub.tenmonhoc}
                </option>
              ))
            ) : (
              <option value="">Không có môn học</option>
            )}
          </select>
        </div>
        <div>
          <label className="block font-medium" htmlFor="duration">
            Thời gian thi (phút)
          </label>
          <select
            id="duration"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          >
            <option value={10}>10 phút</option>
            <option value={15}>15 phút</option>
            <option value={20}>20 phút</option>
            <option value={30}>30 phút</option>
          </select>
        </div>
        <div>
          <label className="block font-medium" htmlFor="numQuestions">
            Số câu hỏi
          </label>
          <input
            type="number"
            id="numQuestions"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            min={5}
            required
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="startTime">
            Thời gian bắt đầu
          </label>
          <input
            type="datetime-local"
            id="startTime"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="examType">
            Loại thi
          </label>
          <select
            id="examType"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option value="dethi">Đề thi</option>
            <option value="onthi">Ôn thi</option>
          </select>
        </div>
        <div className="flex justify-center col-span-2">
          <button
            type="submit"
            className="h-10 w-full bg-slate-100 border border-gray-300 rounded-md hover:bg-green-500 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;