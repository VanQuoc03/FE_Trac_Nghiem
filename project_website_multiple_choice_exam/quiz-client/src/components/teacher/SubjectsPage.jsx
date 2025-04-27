import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdSsidChart } from "react-icons/md";
import { PiWarningCircleThin } from "react-icons/pi";
import axios from "axios";

const API_MONHOC = "/api/monhoc";

const SubjectsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [monHocList, setMonhocList] = useState([]);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "teacher") {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const fetchMonHoc = async () => {
      try {
        const res = await axios.get(API_MONHOC, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
            "Content-Type": "application/json",
          },
        });
        setMonhocList(res.data);
        setSubjects(res.data.map((item) => item.tenmonhoc));
      } catch (error) {
        console.error("Lỗi khi lấy môn học:", error);
        setError(error.response?.data?.message || "Không thể tải môn học");
      }
    };

    const fetchExams = async () => {
      try {
        const res = await axios.get(`/api/dethi/giaovien/${storedUser.id}`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
            "Content-Type": "application/json",
          },
        });
        setExams(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy đề thi:", error);
        setError(error.response?.data?.message || "Không thể tải đề thi");
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    Promise.all([fetchMonHoc(), fetchExams()]).finally(() => setLoading(false));
  }, [navigate]);

  const getTenMonHoc = (id_monhoc) => {
    const found = monHocList.find((m) => m.id_monhoc === id_monhoc);
    return found ? found.tenmonhoc : "Không rõ";
  };

  const filteredExams = exams.filter((item) => {
    const mon = getTenMonHoc(item.id_monhoc);
    return (
      (selectedSubject === "Tất cả" || mon === selectedSubject) &&
      item.id_giaovien === user?.id
    );
  });

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="w-[90%] mx-auto mt-24">
      <div className="flex gap-8">
        {/* Sidebar: Teacher's Information */}
        <div className="bg-white w-[28%] h-[450px] rounded-xl shadow-md p-4">
          <div className="flex justify-center mb-4">
            <FaUserCircle className="text-5xl" />
          </div>
          <div className="text-center mb-4">
            <p className="font-semibold">{user?.ten_giaovien || "Giáo viên"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="italic text-sm mb-4 flex items-center justify-center">
            <PiWarningCircleThin className="text-lg mr-2" />
            Bạn chưa tạo mục tiêu cho quá trình luyện thi của mình. Tạo ngay!
          </div>
          <div className="flex justify-center">
            <button className="text-white bg-[#C7A36F] rounded-full w-[80%] flex items-center justify-center h-[40px] hover:bg-[#9c7a4e] transition-all">
              <MdSsidChart className="mr-2" />
              Thống kê kết quả
            </button>
          </div>
        </div>

        <div className="w-[70%]">
          <h2 className="font-medium text-3xl mb-6">Thư viện đề thi</h2>

          {/* Filter: Subjects & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedSubject === "Tất cả"
                    ? "bg-[#C7A36F] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedSubject("Tất cả")}
              >
                Tất cả
              </button>
              {filteredSubjects.map((subject, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-md ${
                    selectedSubject === subject
                      ? "bg-[#C7A36F] text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>

            <div className="flex w-[80%] md:w-[40%]">
              <input
                className="w-full h-[35px] pl-2 border-2 rounded-l-md"
                type="text"
                placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#C7A36F] w-[30%] rounded-r-md text-white">
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Exam list */}
          <div className="flex items-center flex-wrap justify-start border-t-2 border-gray-200 mt-8">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <Link
                  key={exam.id_dethi}
                  to={`/teacher/exam/${exam.id_dethi}`}
                  className="w-[30%] h-[250px] bg-white p-4 rounded-md m-4 flex flex-col shadow-md transition-transform duration-200 hover:scale-105"
                >
                  <h3 className="font-bold">{exam.id_dethi}</h3>
                  <h3 className="font-bold">{getTenMonHoc(exam.id_monhoc)}</h3>
                  <p className="font-semibold">{user?.ten_giaovien || "Giáo viên"}</p>
                  <p>Thời gian: {exam.thoigianthi} phút</p>
                  <span className="w-[35%] text-sm rounded-full flex justify-center bg-[#C7A36F] text-white">
                    #{getTenMonHoc(exam.id_monhoc)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="w-full text-center">Không có đề thi nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
