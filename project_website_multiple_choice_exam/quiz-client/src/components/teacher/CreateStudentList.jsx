import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateStudentList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { examData } = state || {};
  const [allowedStudents, setAllowedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "teacher" || !examData?.id_dethi) {
      navigate("/login");
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://quiz-api-34vp.onrender.com/api/hocsinh", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudents(response.data);

        // Fetch existing student assignments
        const examResponse = await axios.get(`https://quiz-api-34vp.onrender.com/api/dethi/${examData.id_dethi}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAllowedStudents(
          examResponse.data.allowed_students.map((s) => s.id_hocsinh)
        );
      } catch (err) {
        console.error("Lỗi khi tải danh sách học sinh:", err);
        setError(err.response?.data?.message || "Không thể tải danh sách học sinh");
      }
    };

    fetchStudents();
  }, [navigate, examData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate that at least one student is selected
    if (allowedStudents.length === 0) {
      setError("Vui lòng chọn ít nhất một học sinh!");
      setLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.post(
        `https://quiz-api-34vp.onrender.com/api/dethi/${examData.id_dethi}/students`,
        {
          is_restricted: 1, // Always restricted
          allowed_students: allowedStudents,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Cập nhật danh sách học sinh thành công!");
      navigate("/teacher"); // Adjust to your teacher dashboard route
    } catch (err) {
      console.error("Lỗi khi lưu danh sách học sinh:", err);
      setError(err.response?.data?.message || "Lỗi khi lưu danh sách học sinh!");
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term (name or ID)
  const filteredStudents = students.filter(
    (student) =>
      student.ten_hocsinh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id_hocsinh.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select all filtered students
  const handleSelectAll = () => {
    const filteredIds = filteredStudents.map((student) => student.id_hocsinh);
    setAllowedStudents([...new Set([...allowedStudents, ...filteredIds])]);
  };

  // Deselect all filtered students
  const handleDeselectAll = () => {
    const filteredIds = filteredStudents.map((student) => student.id_hocsinh);
    setAllowedStudents(allowedStudents.filter((id) => !filteredIds.includes(id)));
  };

  // Toggle a single student
  const handleToggleStudent = (id_hocsinh) => {
    if (allowedStudents.includes(id_hocsinh)) {
      setAllowedStudents(allowedStudents.filter((id) => id !== id_hocsinh));
    } else {
      setAllowedStudents([...allowedStudents, id_hocsinh]);
    }
  };

  if (!examData) {
    return <div className="text-center mt-10 text-red-500">Dữ liệu đề thi không hợp lệ</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-md w-[90%] mx-auto mt-10">
      <h2 className="text-4xl flex justify-center m-5 font-medium">
        Tạo danh sách học sinh cho đề thi: {examData.tendethi}
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block font-medium" htmlFor="searchStudents">
            Tìm kiếm học sinh
          </label>
          <input
            type="text"
            id="searchStudents"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Nhập tên hoặc mã số học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Chọn học sinh</label>
          <div className="flex justify-between items-center mb-2">
            <span>{filteredStudents.length} học sinh được tìm thấy</span>
            {filteredStudents.length > 0 && (
              <div>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
                  onClick={handleSelectAll}
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                  onClick={handleDeselectAll}
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}
          </div>
          {filteredStudents.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy học sinh phù hợp</p>
          ) : (
            <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
              {filteredStudents.map((student) => (
                <div
                  key={student.id_hocsinh}
                  className="flex items-center py-1"
                >
                  <input
                    type="checkbox"
                    id={`student-${student.id_hocsinh}`}
                    checked={allowedStudents.includes(student.id_hocsinh)}
                    onChange={() => handleToggleStudent(student.id_hocsinh)}
                    className="mr-2"
                  />
                  <label htmlFor={`student-${student.id_hocsinh}`}>
                    {student.ten_hocsinh} ({student.id_hocsinh})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Học sinh đã chọn ({allowedStudents.length})</label>
          {allowedStudents.length === 0 ? (
            <p className="text-gray-500">Chưa chọn học sinh nào</p>
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
                      onClick={() => handleToggleStudent(id)}
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
            type="submit"
            className="h-10 w-full bg-slate-100 border border-gray-300 rounded-md hover:bg-green-500 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu danh sách"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudentList;
