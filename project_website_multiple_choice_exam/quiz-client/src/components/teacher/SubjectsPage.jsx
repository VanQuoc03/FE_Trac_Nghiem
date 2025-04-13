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
    <div className="w-[80%] mx-auto mt-11">
      <div className="flex justify-between">
        <div className="w-[75%]">
          <h2 className="font-medium text-3xl mb-6">Thư viện đề thi</h2>
          <div className="flex space-x-4 mb-8">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedSubject === "Tất cả"
                  ? "bg-green-500 text-white"
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
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <input
              className="border-2 rounded-l-md w-[100%] h-[35px] pl-2"
              type="text"
              placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-green-500 w-[100px] rounded-r-md text-white">
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="bg-white justify-center w-[25%] h-[320px] box rounded-xl m-4 shadow-md">
          <div className="flex flex-wrap justify-center relative mt-4">
            <FaUserCircle className="size-14" />
            <div className="absolute mr-16">
              <p className="absolute w-[100px] mt-12">{user?.ten_giaovien || "Giáo viên"}</p>
            </div>
          </div>
          <hr className="mt-7 border-gray-400" />
          <div className="flex italic m-4">
            <PiWarningCircleThin className="size-6" />
            <p className="text-sm">
              Bạn chưa tạo mục tiêu cho quá trình luyện thi của mình. Tạo ngay
            </p>
          </div>
          <div className="flex justify-center">
            <button className="text-white bg-green-500 rounded-full w-[90%] justify-center flex items-center h-[35px]">
              <MdSsidChart />
              Thống kê kết quả
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-center border-t-2 border-gray-200 mt-8">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Link
              key={exam.id_dethi}
              to={`/teacher/exam/${exam.id_dethi}`}
              className="w-[20%] h-[200px] justify-between bg-white p-4 rounded-md m-4 flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            >
              <h3 className="font-bold">{exam.id_dethi}</h3>
              <h3 className="font-bold">{getTenMonHoc(exam.id_monhoc)}</h3>
              <p className="font-semibold">{user?.ten_giaovien || "Giáo viên"}</p>
              <p>Thời gian: {exam.thoigianthi} phút</p>
              <span className="w-[35%] text-sm rounded-full flex justify-center bg-green-500 text-white">
                #{getTenMonHoc(exam.id_monhoc)}
              </span>
            </Link>
          ))
        ) : (
          <p>Không có đề thi nào.</p>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;