import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditExam = () => {
  const { id_dethi } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    noidungcauhoi: "",
    dapan: "",
    options: ["", "", "", ""],
  });
  const [id_monhoc, setIdMonhoc] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`/api/dethi/${id_dethi}`);
        console.log("Backend response:", res.data);

        // Assume thoigianbatdau is in local timezone (YYYY-MM-DD HH:mm:ss)
        let thoigianbatdau = "";
        if (res.data.thoigianbatdau) {
          const date = new Date(res.data.thoigianbatdau);
          if (!isNaN(date.getTime())) {
            // Format for datetime-local (YYYY-MM-DDTHH:mm)
            const pad = (num) => String(num).padStart(2, "0");
            thoigianbatdau = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
          }
        }

        setForm({
          thoigianthi: res.data.thoigianthi,
          trangthai: res.data.trangthai,
          thoigianbatdau,
        });
        setQuestions(res.data.questions || []);
        setIdMonhoc(res.data.id_monhoc);
      } catch (error) {
        console.log("Lỗi khi tải đề thi:", error);
        setError("Không thể tải đề thi");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id_dethi]);

  const handleExamChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleUpdateQuestion = async (questionIndex) => {
    const question = questions[questionIndex];
    try {
      if (!question.options.includes(question.dapan)) {
        setError("Đáp án đúng phải nằm trong các lựa chọn!");
        return;
      }

      await axios.put(`/api/questions/${question.id_cauhoi}`, {
        noidungcauhoi: question.noidungcauhoi,
        dapan: question.dapan,
        options: question.options,
      });
      setError("");
      alert("Cập nhật câu hỏi thành công!");
    } catch (error) {
      console.log("Lỗi khi cập nhật câu hỏi:", error);
      setError(error.response?.data?.message || "Cập nhật câu hỏi thất bại!");
    }
  };

  const handleDeleteQuestion = async (questionIndex) => {
    const question = questions[questionIndex];
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;

    try {
      await axios.delete(`/api/questions/${question.id_cauhoi}`);
      const updatedQuestions = questions.filter((_, i) => i !== questionIndex);
      setQuestions(updatedQuestions);
      setError("");
      alert("Xóa câu hỏi thành công!");
    } catch (error) {
      console.log("Lỗi khi xóa câu hỏi:", error);
      setError(error.response?.data?.message || "Xóa câu hỏi thất bại!");
    }
  };

  const handleNewQuestionChange = (field, value) => {
    setNewQuestion({ ...newQuestion, [field]: value });
  };

  const handleNewOptionChange = (optionIndex, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[optionIndex] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      if (
        !newQuestion.noidungcauhoi ||
        !newQuestion.dapan ||
        newQuestion.options.some((opt) => !opt)
      ) {
        setError("Vui lòng điền đầy đủ nội dung câu hỏi, đáp án, và 4 lựa chọn");
        return;
      }

      if (newQuestion.options.length !== 4) {
        setError("Câu hỏi phải có đúng 4 lựa chọn");
        return;
      }

      if (!newQuestion.options.includes(newQuestion.dapan)) {
        setError("Đáp án đúng phải nằm trong các lựa chọn!");
        return;
      }

      const res = await axios.post(`/api/questions`, {
        examId: id_dethi,
        questions: [
          {
            text: newQuestion.noidungcauhoi,
            correctAnswer: newQuestion.dapan,
            options: newQuestion.options,
            id_monhoc,
          },
        ],
      });

      setQuestions([...questions, ...res.data.questions]);
      setNewQuestion({
        noidungcauhoi: "",
        dapan: "",
        options: ["", "", "", ""],
      });
      setError("");
      alert("Thêm câu hỏi thành công!");
    } catch (error) {
      console.log("Lỗi khi thêm câu hỏi:", error);
      setError(error.response?.data?.message || "Thêm câu hỏi thất bại!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { thoigianthi, trangthai, thoigianbatdau } = form;
      console.log("Form thoigianbatdau:", thoigianbatdau);

      // Parse thoigianbatdau as local time
      const localStartTime = new Date(thoigianbatdau);
      if (isNaN(localStartTime.getTime())) {
        setError("Thời gian bắt đầu không hợp lệ!");
        return;
      }

      // Format as YYYY-MM-DD HH:mm:ss (local time)
      const pad = (num) => String(num).padStart(2, "0");
      const formattedStartTime = `${localStartTime.getFullYear()}-${pad(localStartTime.getMonth() + 1)}-${pad(localStartTime.getDate())} ${pad(localStartTime.getHours())}:${pad(localStartTime.getMinutes())}:${pad(localStartTime.getSeconds())}`;

      console.log("Sending formattedStartTime:", formattedStartTime);

      await axios.put(`/api/dethi/${id_dethi}`, {
        thoigianthi: parseInt(thoigianthi),
        trangthai,
        thoigianbatdau: formattedStartTime,
      });
      alert("Cập nhật đề thi thành công!");
      navigate("/teacher/exams");
    } catch (error) {
      console.log("Lỗi khi cập nhật đề thi:", error);
      setError(error.response?.data?.message || "Cập nhật đề thi thất bại!");
    }
  };

  if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  if (error && !form) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!form) return <div className="text-center mt-10">Không tìm thấy đề thi</div>;

  return (
    <div className="max-w-4xl mx-auto shadow rounded bg-white mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa đề thi {id_dethi}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="thoigianthi" className="block font-medium mb-1">
          Thời gian thi (Phút)
        </label>
        <input
          type="number"
          name="thoigianthi"
          className="border w-full p-2 rounded mb-4"
          value={form.thoigianthi}
          onChange={handleExamChange}
          min="1"
          required
        />

        <label htmlFor="thoigianbatdau" className="block font-medium mb-1">
          Thời gian bắt đầu
        </label>
        <input
          type="datetime-local"
          name="thoigianbatdau"
          className="border w-full p-2 rounded mb-4"
          value={form.thoigianbatdau}
          onChange={handleExamChange}
          required
        />

        <label htmlFor="trangthai" className="block font-medium mb-1">
          Trạng thái
        </label>
        <select
          name="trangthai"
          value={form.trangthai}
          onChange={handleExamChange}
          className="border w-full p-2 rounded mb-4"
          required
        >
          <option value="onthi">Ôn thi</option>
          <option value="dethi">Đề thi</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Lưu đề thi
        </button>
      </form>

      <h3 className="text-xl font-bold mt-6 mb-4">Thêm câu hỏi mới</h3>
      <form onSubmit={handleAddQuestion} className="border p-4 mb-4 rounded">
        <label className="block font-medium mb-1">Nội dung câu hỏi</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-2"
          value={newQuestion.noidungcauhoi}
          onChange={(e) => handleNewQuestionChange("noidungcauhoi", e.target.value)}
          required
        />

        <label className="block font-medium mb-1">Đáp án đúng</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-2"
          value={newQuestion.dapan}
          onChange={(e) => handleNewQuestionChange("dapan", e.target.value)}
          required
        />

        <label className="block font-medium mb-1">Các lựa chọn</label>
        {newQuestion.options.map((option, oIndex) => (
          <div key={oIndex} className="flex items-center mb-2">
            <span className="mr-2">{String.fromCharCode(65 + oIndex)}. </span>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={option}
              onChange={(e) => handleNewOptionChange(oIndex, e.target.value)}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Thêm câu hỏi
        </button>
      </form>

      <h3 className="text-xl font-bold mt-6 mb-4">Danh sách câu hỏi</h3>
      {questions.length > 0 ? (
        questions.map((question, qIndex) => (
          <div key={question.id_cauhoi} className="border p-4 mb-4 rounded">
            <label className="block font-medium mb-1">Câu hỏi {qIndex + 1}</label>
            <input
              type="text"
              className="border w-full p-2 rounded mb-2"
              value={question.noidungcauhoi}
              onChange={(e) =>
                handleQuestionChange(qIndex, "noidungcauhoi", e.target.value)
              }
            />

            <label className="block font-medium mb-1">Đáp án đúng</label>
            <input
              type="text"
              className="border w-full p-2 rounded mb-2"
              value={question.dapan}
              onChange={(e) => handleQuestionChange(qIndex, "dapan", e.target.value)}
            />

            <label className="block font-medium mb-1">Các lựa chọn</label>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center mb-2">
                <span className="mr-2">{String.fromCharCode(65 + oIndex)}. </span>
                <input
                  type="text"
                  className="border w-full p-2 rounded"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                />
              </div>
            ))}

            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                onClick={() => handleUpdateQuestion(qIndex)}
              >
                Cập nhật câu hỏi
              </button>
              <button
                type="button"
                className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                onClick={() => handleDeleteQuestion(qIndex)}
              >
                Xóa câu hỏi
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Không có câu hỏi nào cho đề thi này.</p>
      )}
    </div>
  );
};

export default EditExam;