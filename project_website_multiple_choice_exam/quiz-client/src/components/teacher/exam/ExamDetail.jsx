import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ExamDetail = () => {
  const navigate = useNavigate();
  const { id_dethi } = useParams();
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [allowedStudents, setAllowedStudents] = useState([]);
  const [isRestricted, setIsRestricted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API = `https://quiz-api-34vp.onrender.com/api/dethi/${id_dethi}`;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "teacher") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [examRes, studentsRes] = await Promise.all([
          axios.get(API, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get("/api/hocsinh", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setExam(examRes.data);
        setStudents(studentsRes.data);
        setAllowedStudents(
          examRes.data.allowed_students.map((s) => s.id_hocsinh)
        );
        setIsRestricted(examRes.data.is_restricted);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError(error.response?.data?.message || "Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, [id_dethi, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`https://quiz-api-34vp.onrender.com/api/dethi/${id_dethi}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Xóa đề thi thành công!");
      navigate("/teacher/exams");
    } catch (error) {
      console.error("Lỗi khi xóa đề thi:", error);
      alert("Xóa đề thi thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSaveStudents = async () => {
    if (isRestricted && allowedStudents.length === 0) {
      setError("Vui lòng chọn ít nhất một học sinh khi giới hạn đề thi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `https://quiz-api-34vp.onrender.com/api/dethi/${id_dethi}/students`,
        {
          is_restricted: isRestricted ? 1 : 0,
          allowed_students: isRestricted ? allowedStudents : [],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Cập nhật danh sách học sinh thành công!");
      // Refresh exam data
      const examRes = await axios.get(API, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExam(examRes.data);
      setAllowedStudents(examRes.data.allowed_students.map((s) => s.id_hocsinh));
      setIsRestricted(examRes.data.is_restricted);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách học sinh:", error);
      setError(error.response?.data?.message || "Lỗi khi cập nhật danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  // Filter students by id_hocsinh for search
  const filteredStudents = searchTerm
    ? students.filter((student) =>
        student.id_hocsinh.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Add a student to allowedStudents
  const handleAddStudent = (id_hocsinh) => {
    if (!allowedStudents.includes(id_hocsinh)) {
      setAllowedStudents([...allowedStudents, id_hocsinh]);
      setSearchTerm(""); // Clear search after adding
    }
  };

  // Remove a student from allowedStudents
  const handleRemoveStudent = (id_hocsinh) => {
    setAllowedStudents(allowedStudents.filter((id) => id !== id_hocsinh));
  };

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!exam) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 shadow rounded bg-white">
      <h1 className="text-2xl font-bold mb-4">
        Chi tiết đề thi: {exam.id_dethi}
      </h1>
      <p>
        <strong>Ngày tạo: </strong>
        {new Date(exam.ngay_tao).toLocaleDateString("vi-VN")}
      </p>
      <p>
        <strong>Môn thi: </strong>
        {exam.tenmonhoc || "Không rõ"}
      </p>
      <p>
        <strong>Thời gian thi: </strong>
        {exam.thoigianthi} phút
      </p>
      <p>
        <strong>Trạng thái: </strong>
        {exam.trangthai || "Không rõ"}
      </p>
      <p>
        <strong>Giáo viên: </strong>
        {exam.ten_giaovien || "Không rõ"}
      </p>

      <h3 className="text-xl font-bold mt-6 mb-4">Danh sách câu hỏi</h3>
      {exam.questions && exam.questions.length > 0 ? (
        exam.questions.map((question, index) => (
          <div key={question.id_cauhoi || index} className="border p-4 mb-4 rounded">
            <p>
              <strong>Câu hỏi {index + 1}: </strong>
              {question.noidungcauhoi || "Không có nội dung"}
            </p>
            <p>
              <strong>Đáp án đúng: </strong>
              {question.dapan || "Không có"}
            </p>
            <p>
              <strong>Các lựa chọn: </strong>
            </p>
            <ul className="list-disc ml-6">
              {(question.options || []).map((option, oIndex) => (
                <li key={oIndex}>
                  {String.fromCharCode(65 + oIndex)}. {option || "Không có"}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Không có câu hỏi nào cho đề thi này.</p>
      )}

      <h3 className="text-xl font-bold mt-6 mb-4">Quản lý học sinh được thi</h3>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isRestricted}
            onChange={(e) => setIsRestricted(e.target.checked)}
            className="mr-2"
          />
          Giới hạn học sinh được thi
        </label>
      </div>
      {isRestricted && (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="searchStudents">
              Tìm kiếm học sinh theo mã
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="searchStudents"
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Nhập mã học sinh (ví dụ: HS001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchTerm("")}
                >
                  X
                </button>
              )}
            </div>
            {searchTerm && filteredStudents.length > 0 && (
              <ul className="border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <li
                    key={student.id_hocsinh}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddStudent(student.id_hocsinh)}
                  >
                    <span>
                      {student.ten_hocsinh} ({student.id_hocsinh})
                    </span>
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Thêm
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchTerm && filteredStudents.length === 0 && (
              <p className="text-gray-500 mt-2">Không tìm thấy học sinh với mã này</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Học sinh được phép thi ({allowedStudents.length})
            </label>
            {allowedStudents.length === 0 ? (
              <p className="text-gray-500">Chưa có học sinh nào được chọn</p>
            ) : (
              <ul className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
                {allowedStudents.map((id) => {
                  const student = students.find((s) => s.id_hocsinh === id);
                  return (
                    <li
                      key={id}
                      className="flex justify-between items-center py-1"
                    >
                      <span>
                        {student
                          ? `${student.ten_hocsinh} (${student.id_hocsinh})`
                          : id}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveStudent(id)}
                      >
                        Xóa
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              onClick={handleSaveStudents}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu danh sách học sinh"}
            </button>
          </div>
        </>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
          onClick={() => navigate(`/teacher/dethi/edit/${exam.id_dethi}`)}
        >
          Sửa đề thi
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Xóa đề thi
        </button>
      </div>
    </div>
  );
};

export default ExamDetail;
